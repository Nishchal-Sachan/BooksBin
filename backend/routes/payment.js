const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Initialize Razorpay instance only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay credentials not configured. Payment endpoints will not work.');
  console.warn('   Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file');
}

/**
 * POST /api/payment/create-order
 * Create a Razorpay order for checkout
 */
router.post('/create-order', authenticate, async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({
        message: 'Payment service not configured. Please contact administrator.'
      });
    }

    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Validate order exists and belongs to user
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: currency,
      receipt: orderId || `receipt_${Date.now()}`,
      notes: {
        orderId: orderId || '',
        userId: req.user._id.toString()
      }
    });

    // Update order with Razorpay order ID if orderId provided
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'payment.razorpayOrderId': razorpayOrder.id
      });
    }

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      message: 'Payment processing error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature and update order status
 */
router.post('/verify', authenticate, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        message: 'Missing required payment verification parameters'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user owns this order
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify the payment signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Invalid signature - possible tampering
      order.payment.status = 'failed';
      await order.save();

      return res.status(400).json({
        message: 'Payment verification failed - invalid signature'
      });
    }

    // Signature is valid - update order
    order.payment.status = 'completed';
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.transactionId = razorpay_payment_id;
    order.status = 'confirmed';

    await order.save();

    // Clear user's cart after successful payment
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email');

    res.json({
      message: 'Payment verified successfully',
      order: populatedOrder,
      success: true
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      message: 'Payment verification error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/payment/webhook
 * Handle Razorpay webhook events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.headers['x-razorpay-signature'];

    if (!webhookSecret) {
      console.warn('Razorpay webhook secret not configured');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== webhookSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    console.log('Razorpay webhook event:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        // Payment was successful
        const orderId = payload.notes?.orderId;
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            'payment.status': 'completed',
            'payment.razorpayPaymentId': payload.id,
            'payment.transactionId': payload.id,
            status: 'confirmed'
          });
          console.log(`Order ${orderId} payment captured via webhook`);
        }
        break;

      case 'payment.failed':
        // Payment failed
        const failedOrderId = payload.notes?.orderId;
        if (failedOrderId) {
          await Order.findByIdAndUpdate(failedOrderId, {
            'payment.status': 'failed'
          });
          console.log(`Order ${failedOrderId} payment failed via webhook`);
        }
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * GET /api/payment/payment-methods
 * Get available payment methods
 */
router.get('/payment-methods', authenticate, async (req, res) => {
  try {
    res.json({
      methods: [
        { id: 'razorpay', name: 'Cards, UPI, Netbanking, Wallets', type: 'razorpay' },
        { id: 'cod', name: 'Cash on Delivery', type: 'cod' }
      ]
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
