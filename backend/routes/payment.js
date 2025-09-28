const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderId || '',
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// Confirm payment
router.post('/confirm-payment', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ message: 'Payment intent ID and order ID are required' });
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Update order with payment details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.payment.status = 'completed';
    order.payment.transactionId = paymentIntent.id;
    order.payment.paymentIntentId = paymentIntent.id;
    order.status = 'confirmed';

    await order.save();

    res.json({ 
      message: 'Payment confirmed successfully',
      order 
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Payment confirmation error' });
  }
});

// Create checkout session
router.post('/create-checkout-session', authenticate, async (req, res) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    // Get book details
    const bookIds = items.map(item => item.book);
    const books = await Book.find({ _id: { $in: bookIds }, isActive: true });

    if (books.length !== bookIds.length) {
      return res.status(400).json({ message: 'One or more books are not available' });
    }

    // Create line items for Stripe
    const lineItems = items.map(item => {
      const book = books.find(b => b._id.toString() === item.book);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: book.title,
            description: `By ${book.author}`,
            images: book.images.length > 0 ? [book.images[0].url] : []
          },
          unit_amount: Math.round(book.price * 100) // Convert to cents
        },
        quantity: item.quantity
      };
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/checkout/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Checkout session creation error' });
  }
});

// Handle Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        
        // Update order status if needed
        if (paymentIntent.metadata.orderId) {
          await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
            'payment.status': 'completed',
            'payment.transactionId': paymentIntent.id,
            'payment.paymentIntentId': paymentIntent.id,
            status: 'confirmed'
          });
        }
        break;

      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Create order from checkout session
        if (session.metadata.userId) {
          // This would require storing session data and recreating the order
          // Implementation depends on your specific needs
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Get payment methods
router.get('/payment-methods', authenticate, async (req, res) => {
  try {
    // In a real implementation, you might want to store customer IDs
    // and retrieve their payment methods
    res.json({ 
      methods: [
        { id: 'card', name: 'Credit/Debit Card', type: 'card' },
        { id: 'paypal', name: 'PayPal', type: 'paypal' }
      ]
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refund payment
router.post('/refund', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
      reason: reason || 'requested_by_customer'
    });

    // Update order status
    const order = await Order.findOne({ 'payment.paymentIntentId': paymentIntentId });
    if (order) {
      order.payment.status = 'refunded';
      order.status = 'cancelled';
      await order.save();
    }

    res.json({ 
      message: 'Refund processed successfully',
      refund 
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Refund processing error' });
  }
});

module.exports = router;
