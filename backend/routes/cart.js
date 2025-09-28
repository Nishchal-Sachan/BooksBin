const express = require('express');
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const { authenticate } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validation');

const router = express.Router();

// Get user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.book',
      select: 'title author price images ratings stock isActive'
    });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    // Filter out inactive books
    cart.items = cart.items.filter(item => item.book && item.book.isActive);

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    // Check if book exists and is active
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found or not available' });
    }

    // Check stock availability
    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.book.toString() === bookId);

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 10) {
        return res.status(400).json({ message: 'Maximum quantity per item is 10' });
      }
      if (book.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item
      if (quantity > 10) {
        return res.status(400).json({ message: 'Maximum quantity per item is 10' });
      }
      cart.items.push({ book: bookId, quantity });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.book',
      select: 'title author price images ratings stock isActive'
    });

    res.json({ 
      message: 'Item added to cart successfully',
      cart: populatedCart 
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item quantity
router.put('/update', authenticate, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || quantity === undefined) {
      return res.status(400).json({ message: 'Book ID and quantity are required' });
    }

    if (quantity < 0 || quantity > 10) {
      return res.status(400).json({ message: 'Quantity must be between 0 and 10' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.book.toString() === bookId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item
      cart.items = cart.items.filter(item => item.book.toString() !== bookId);
    } else {
      // Check stock availability
      const book = await Book.findById(bookId);
      if (!book || !book.isActive) {
        return res.status(404).json({ message: 'Book not found or not available' });
      }
      if (book.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      item.quantity = quantity;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.book',
      select: 'title author price images ratings stock isActive'
    });

    res.json({ 
      message: 'Cart updated successfully',
      cart: populatedCart 
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:bookId', authenticate, validateObjectId('bookId'), async (req, res) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.book.toString() !== bookId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.book',
      select: 'title author price images ratings stock isActive'
    });

    res.json({ 
      message: 'Item removed from cart successfully',
      cart: populatedCart 
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ 
      message: 'Cart cleared successfully',
      cart 
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cart count
router.get('/count', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const count = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    res.json({ count });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
