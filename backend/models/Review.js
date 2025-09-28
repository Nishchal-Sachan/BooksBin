const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Review comment cannot exceed 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  images: [{
    url: String,
    publicId: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per book
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

// Index for book reviews
reviewSchema.index({ book: 1, createdAt: -1 });

// Index for user reviews
reviewSchema.index({ user: 1, createdAt: -1 });

// Update book ratings when review is saved
reviewSchema.post('save', async function() {
  await this.constructor.updateBookRatings(this.book);
});

// Update book ratings when review is deleted
reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.constructor.updateBookRatings(this.book);
});

// Static method to update book ratings
reviewSchema.statics.updateBookRatings = async function(bookId) {
  const stats = await this.aggregate([
    { $match: { book: bookId, isActive: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
      'ratings.count': stats[0].totalReviews
    });
  } else {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      'ratings.average': 0,
      'ratings.count': 0
    });
  }
};

module.exports = mongoose.model('Review', reviewSchema);
