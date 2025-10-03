const express = require('express');
const Book = require('../models/Book');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth');
const { validateBook, validatePagination, validateObjectId } = require('../middlewares/validation');

const router = express.Router();

// Get all books with filters and pagination
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      condition,
      seller
    } = req.query;

    const filter = { isActive: true };

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (minRating) {
      filter['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    // Condition filter
    if (condition) {
      filter.condition = condition;
    }

    // Seller filter
    if (seller) {
      filter.seller = seller;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const books = await Book.find(filter)
      .populate('seller', 'name email')
      .sort(sortOptions)
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
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured books
router.get('/featured', async (req, res) => {
  try {
    const books = await Book.find({ isActive: true, isFeatured: true })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    res.json({ books });
  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID
router.get('/:id', optionalAuth, validateObjectId('id'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'name email')
      .lean();

    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Increment view count
    await Book.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related books
router.get('/:id/related', validateObjectId('id'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const relatedBooks = await Book.find({
      _id: { $ne: book._id },
      category: book.category,
      isActive: true
    })
      .populate('seller', 'name email')
      .limit(4)
      .lean();

    res.json({ books: relatedBooks });
  } catch (error) {
    console.error('Get related books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create book (seller only)
router.post('/', authenticate, authorize('seller', 'admin'), validateBook, async (req, res) => {
  try {
    console.log("Incoming book data:", req.body); // 👈 log request
    const bookData = {
      ...req.body,
      seller: req.user._id
    };

    const book = new Book(bookData);
    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('seller', 'name email');

    res.status(201).json({ book: populatedBook, message: 'Book created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book (seller or admin)
router.put('/:id', authenticate, validateObjectId('id'), validateBook, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the seller or admin
    if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    res.json({ book: updatedBook, message: 'Book updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book (seller or admin)
router.delete('/:id', authenticate, validateObjectId('id'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the seller or admin
    if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
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

// Get book categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Book.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status (admin only)
router.patch('/:id/featured', authenticate, authorize('admin'), validateObjectId('id'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.isFeatured = !book.isFeatured;
    await book.save();

    res.json({ 
      message: `Book ${book.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      book 
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
