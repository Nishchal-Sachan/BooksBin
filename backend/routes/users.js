const express = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateAddress, validatePagination, validateObjectId } = require('../middlewares/validation');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, profile } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (profile) updates.profile = { ...req.user.profile, ...profile };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add address
router.post('/addresses', authenticate, validateAddress, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    // If this address is set as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({ 
      message: 'Address added successfully',
      addresses: user.addresses 
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
router.put('/addresses/:addressId', authenticate, validateAddress, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this address is set as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({ 
      message: 'Address updated successfully',
      addresses: user.addresses 
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
router.delete('/addresses/:addressId', authenticate, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    address.remove();

    // If we removed the default address, make the first remaining one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({ 
      message: 'Address deleted successfully',
      addresses: user.addresses 
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wishlist
router.get('/wishlist', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'title author price images ratings category');

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to wishlist
router.post('/wishlist/:bookId', authenticate, validateObjectId('bookId'), async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    user.wishlist.push(bookId);
    await user.save();

    res.json({ message: 'Book added to wishlist successfully' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/wishlist/:bookId', authenticate, validateObjectId('bookId'), async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(bookId);
    if (index === -1) {
      return res.status(404).json({ message: 'Book not found in wishlist' });
    }

    user.wishlist.splice(index, 1);
    await user.save();

    res.json({ message: 'Book removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/admin/all', authenticate, authorize('admin'), validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

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

// Update user status (admin only)
router.patch('/admin/:userId/status', authenticate, authorize('admin'), validateObjectId('userId'), async (req, res) => {
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

// Update user role (admin only)
router.patch('/admin/:userId/role', authenticate, authorize('admin'), validateObjectId('userId'), async (req, res) => {
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

module.exports = router;
