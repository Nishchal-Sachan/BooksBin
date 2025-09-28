const express = require('express');
const Book = require('../models/Book');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate, authorize } = require('../middlewares/auth');
const { validatePagination, validateObjectId } = require('../middlewares/validation');

const router = express.Router();

// Get seller dashboard stats
router.get('/dashboard', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const sellerId = req.user.role === 'admin' && req.query.sellerId ? req.query.sellerId : req.user._id;

    // Get total books
    const totalBooks = await Book.countDocuments({ seller: sellerId, isActive: true });

    // Get total sales
    const salesStats = await Order.aggregate([
      { $match: { 'items.seller': sellerId, status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totals.total' },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: { $sum: '$items.quantity' } }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ 'items.seller': sellerId })
      .populate('customer', 'name email')
      .populate('items.book', 'title author images')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get top selling books
    const topBooks = await Book.aggregate([
      { $match: { seller: sellerId, isActive: true } },
      { $sort: { salesCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          author: 1,
          price: 1,
          salesCount: 1,
          ratings: 1,
          images: 1
        }
      }
    ]);

    // Get monthly sales for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totals.total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        totalBooks,
        totalSales: salesStats[0]?.totalSales || 0,
        totalOrders: salesStats[0]?.totalOrders || 0,
        totalItems: salesStats[0]?.totalItems || 0
      },
      recentOrders,
      topBooks,
      monthlySales
    });
  } catch (error) {
    console.error('Get seller dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller's books
router.get('/books', authenticate, authorize('seller', 'admin'), validatePagination, async (req, res) => {
  try {
    const sellerId = req.user.role === 'admin' && req.query.sellerId ? req.query.sellerId : req.user._id;
    const { page = 1, limit = 12, search, category, status } = req.query;

    const filter = { seller: sellerId };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const books = await Book.find(filter)
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
    console.error('Get seller books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller's orders
router.get('/orders', authenticate, authorize('seller', 'admin'), validatePagination, async (req, res) => {
  try {
    const sellerId = req.user.role === 'admin' && req.query.sellerId ? req.query.sellerId : req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { 'items.seller': sellerId };
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

// Get seller's sales analytics
router.get('/analytics', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const sellerId = req.user.role === 'admin' && req.query.sellerId ? req.query.sellerId : req.user._id;
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

    // Sales over time
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          totalSales: { $sum: '$totals.total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Top selling books
    const topSellingBooks = await Book.aggregate([
      { $match: { seller: sellerId, isActive: true } },
      { $sort: { salesCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          author: 1,
          price: 1,
          salesCount: 1,
          ratings: 1,
          images: 1
        }
      }
    ]);

    // Sales by category
    const salesByCategory = await Book.aggregate([
      { $match: { seller: sellerId, isActive: true } },
      {
        $group: {
          _id: '$category',
          totalSales: { $sum: '$salesCount' },
          revenue: { $sum: { $multiply: ['$price', '$salesCount'] } }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      salesOverTime,
      topSellingBooks,
      salesByCategory,
      orderStatusDistribution
    });
  } catch (error) {
    console.error('Get seller analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller profile
router.get('/profile', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const sellerId = req.user.role === 'admin' && req.query.sellerId ? req.query.sellerId : req.user._id;

    const seller = await User.findById(sellerId)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Get seller stats
    const totalBooks = await Book.countDocuments({ seller: sellerId, isActive: true });
    const totalSales = await Order.aggregate([
      { $match: { 'items.seller': sellerId, status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } }
    ]);

    res.json({
      seller,
      stats: {
        totalBooks,
        totalSales: totalSales[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update seller profile
router.put('/profile', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { name, profile } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (profile) updates.profile = { ...req.user.profile, ...profile };

    const seller = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    res.json({ 
      message: 'Profile updated successfully',
      seller 
    });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sellers (admin only)
router.get('/admin/all', authenticate, authorize('admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = { role: 'seller' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sellers = await User.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get stats for each seller
    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const totalBooks = await Book.countDocuments({ seller: seller._id, isActive: true });
        const totalSales = await Order.aggregate([
          { $match: { 'items.seller': seller._id, status: { $in: ['delivered', 'shipped'] } } },
          { $group: { _id: null, total: { $sum: '$totals.total' } } }
        ]);

        return {
          ...seller,
          stats: {
            totalBooks,
            totalSales: totalSales[0]?.total || 0
          }
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.json({
      sellers: sellersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSellers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all sellers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
