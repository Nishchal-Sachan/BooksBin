const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { authenticate, authorize } = require('../middlewares/auth');
const { validatePagination, validateObjectId } = require('../middlewares/validation');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments({ isActive: true });

    // Get revenue stats
    const revenueStats = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totals.total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totals.total' }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get top selling books
    const topSellingBooks = await Book.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(10)
      .select('title author price salesCount ratings images')
      .lean();

    // Get monthly revenue for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totals.total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get user registration stats
    const userRegistrationStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get category distribution
    const categoryDistribution = await Book.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalReviews,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        totalOrdersRevenue: revenueStats[0]?.totalOrders || 0,
        averageOrderValue: revenueStats[0]?.averageOrderValue || 0
      },
      recentOrders,
      topSellingBooks,
      monthlyRevenue,
      userRegistrationStats,
      orderStatusDistribution,
      categoryDistribution
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all books (admin)
router.get('/books', authenticate, authorize('admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status, seller } = req.query;

    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (seller) filter.seller = seller;

    const books = await Book.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Book.countDocuments(filter);

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin)
router.get('/users', authenticate, authorize('admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin)
router.get('/orders', authenticate, authorize('admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customer, seller } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;
    if (seller) filter['items.seller'] = seller;

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

// Update user status
router.patch('/users/:userId/status', authenticate, authorize('admin'), validateObjectId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.patch('/users/:userId/role', authenticate, authorize('admin'), validateObjectId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User role updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book status
router.patch('/books/:bookId/status', authenticate, authorize('admin'), validateObjectId('bookId'), async (req, res) => {
  try {
    const { bookId } = req.params;
    const { isActive } = req.body;

    const book = await Book.findByIdAndUpdate(
      bookId,
      { isActive },
      { new: true }
    ).populate('seller', 'name email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ 
      message: `Book ${isActive ? 'activated' : 'deactivated'} successfully`,
      book 
    });
  } catch (error) {
    console.error('Update book status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.patch('/orders/:orderId/status', authenticate, authorize('admin'), validateObjectId('orderId'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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

// Delete user
router.delete('/users/:userId', authenticate, authorize('admin'), validateObjectId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to delete self
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book
router.delete('/books/:bookId', authenticate, authorize('admin'), validateObjectId('bookId'), async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Soft delete
    book.isActive = false;
    await book.save();

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics
router.get('/analytics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Revenue over time
    const revenueOverTime = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          revenue: { $sum: '$totals.total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Top selling books
    const topSellingBooks = await Book.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(10)
      .select('title author price salesCount ratings images')
      .lean();

    // Top sellers
    const topSellers = await User.aggregate([
      { $match: { role: 'seller', isActive: true } },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'seller',
          as: 'books'
        }
      },
      {
        $addFields: {
          totalSales: { $sum: '$books.salesCount' },
          totalRevenue: { $sum: { $multiply: ['$books.price', '$books.salesCount'] } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          email: 1,
          totalSales: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.json({
      revenueOverTime,
      topSellingBooks,
      topSellers
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
