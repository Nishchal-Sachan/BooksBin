const express = require('express');
const Order = require('../models/Order');
const Book = require('../models/Book');
const Cart = require('../models/Cart');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateOrder, validatePagination, validateObjectId } = require('../middlewares/validation');

const router = express.Router();

// Create order
router.post('/', authenticate, validateOrder, async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

    // Validate all books exist and are available
    const bookIds = items.map(item => item.book);
    const books = await Book.find({ _id: { $in: bookIds }, isActive: true });

    if (books.length !== bookIds.length) {
      return res.status(400).json({ message: 'One or more books are not available' });
    }

    // Check stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const book = books.find(b => b._id.toString() === item.book);
      
      if (book.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}` 
        });
      }

      const itemTotal = book.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price,
        seller: book.seller
      });
    }

    // Calculate totals
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: paymentMethod || 'stripe',
        amount: total,
        currency: 'usd'
      },
      totals: {
        subtotal,
        tax,
        shipping,
        total
      }
    });

    await order.save();

    // Update book stock
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity, salesCount: item.quantity }
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email');

    res.status(201).json({ 
      message: 'Order created successfully',
      order: populatedOrder 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', authenticate, validateObjectId('id'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.user._id.toString() && 
        !order.items.some(item => item.seller._id.toString() === req.user._id.toString()) &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (seller or admin)
router.patch('/:id/status', authenticate, validateObjectId('id'), async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to update this order
    const isSeller = order.items.some(item => item.seller.toString() === req.user._id.toString());
    if (!isSeller && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;

    if (trackingNumber) {
      order.tracking = {
        trackingNumber,
        carrier: carrier || 'Standard Shipping'
      };
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email');

    res.json({ 
      message: 'Order status updated successfully',
      order: populatedOrder 
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.patch('/:id/cancel', authenticate, validateObjectId('id'), async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to cancel this order
    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = req.user._id;
    order.cancellationReason = reason;

    // Restore book stock
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity, salesCount: -item.quantity }
      });
    }

    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller's orders
router.get('/seller/my-orders', authenticate, authorize('seller', 'admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { 'items.seller': req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', authenticate, authorize('admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customer } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
