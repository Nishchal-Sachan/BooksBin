const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Book = require('../models/Book');
const { authenticate } = require('../middlewares/auth');
const {
  validateReview,
  validateCreateReview,
  validatePagination,
  validateObjectId,
} = require('../middlewares/validation');

const REVIEWABLE_STATUSES = ['shipped', 'delivered'];

const router = express.Router();

// Get reviews for a book
router.get('/book/:bookId', validateObjectId('bookId'), validatePagination, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ book: bookId, isActive: true })
      .populate('user', 'name profile.avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ book: bookId, isActive: true });

    // Get rating statistics
    const stats = await Review.aggregate([
      { $match: { book: bookId, isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: {
              rating: '$rating'
            }
          }
        }
      }
    ]);

    const ratingStats = stats[0] || { averageRating: 0, totalReviews: 0, ratingDistribution: [] };

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      stats: {
        averageRating: Math.round(ratingStats.averageRating * 10) / 10,
        totalReviews: ratingStats.totalReviews
      }
    });
  } catch (error) {
    console.error('Get book reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if the logged-in user can review a book
router.get(
  '/eligibility/:bookId',
  authenticate,
  validateObjectId('bookId'),
  async (req, res) => {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId).select('_id title');
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const existingReview = await Review.findOne({
        user: req.user._id,
        book: bookId,
      })
        .populate('user', 'name')
        .lean();

      if (existingReview) {
        return res.json({
          canReview: false,
          canEdit: true,
          reason: 'You have already reviewed this product.',
          existingReview,
          eligibleOrderId: existingReview.order,
        });
      }

      const eligibleOrder = await Order.findOne({
        customer: req.user._id,
        'items.book': bookId,
        status: { $in: REVIEWABLE_STATUSES },
      })
        .sort({ createdAt: -1 })
        .select('_id orderNumber status createdAt')
        .lean();

      if (!eligibleOrder) {
        return res.json({
          canReview: false,
          canEdit: false,
          reason:
            'You can review after your order is shipped or delivered. Open your order from Account → Orders.',
        });
      }

      res.json({
        canReview: true,
        canEdit: false,
        eligibleOrderId: eligibleOrder._id,
        eligibleOrder,
      });
    } catch (error) {
      console.error('Review eligibility error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's reviews
router.get('/my-reviews', authenticate, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user._id })
      .populate('book', 'title author images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ user: req.user._id });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review
router.post('/', authenticate, validateCreateReview, async (req, res) => {
  try {
    const { bookId, orderId, rating, title, comment, images } = req.body;

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ user: req.user._id, book: bookId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Verify that the user has purchased this book
    const order = await Order.findOne({
      customer: req.user._id,
      _id: orderId,
      'items.book': bookId,
      status: { $in: REVIEWABLE_STATUSES }
    });

    if (!order) {
      return res.status(400).json({ message: 'You can only review books you have purchased' });
    }

    const review = new Review({
      user: req.user._id,
      book: bookId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
      isVerified: true
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name profile.avatar')
      .populate('book', 'title author images');

    res.status(201).json({ 
      message: 'Review created successfully',
      review: populatedReview 
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review
router.put('/:reviewId', authenticate, validateObjectId('reviewId'), validateReview, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.images = images || [];

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name profile.avatar')
      .populate('book', 'title author images');

    res.json({ 
      message: 'Review updated successfully',
      review: populatedReview 
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review
router.delete('/:reviewId', authenticate, validateObjectId('reviewId'), async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const bookId = review.book;
    await Review.findByIdAndDelete(reviewId);
    await Review.updateBookRatings(bookId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', authenticate, validateObjectId('reviewId'), async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has already marked this review as helpful
    if (review.helpful.users.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already marked this review as helpful' });
    }

    review.helpful.users.push(req.user._id);
    review.helpful.count = review.helpful.users.length;
    await review.save();

    res.json({ 
      message: 'Review marked as helpful',
      helpfulCount: review.helpful.count 
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get review statistics for a book
router.get('/book/:bookId/stats', validateObjectId('bookId'), async (req, res) => {
  try {
    const { bookId } = req.params;

    const stats = await Review.aggregate([
      { $match: { book: bookId, isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: {
              $switch: {
                branches: [
                  { case: { $eq: ['$rating', 5] }, then: 'five' },
                  { case: { $eq: ['$rating', 4] }, then: 'four' },
                  { case: { $eq: ['$rating', 3] }, then: 'three' },
                  { case: { $eq: ['$rating', 2] }, then: 'two' },
                  { case: { $eq: ['$rating', 1] }, then: 'one' }
                ],
                default: 'other'
              }
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { one: 0, two: 0, three: 0, four: 0, five: 0 }
      });
    }

    const distribution = { one: 0, two: 0, three: 0, four: 0, five: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      if (distribution.hasOwnProperty(rating)) {
        distribution[rating]++;
      }
    });

    res.json({
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: distribution
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
