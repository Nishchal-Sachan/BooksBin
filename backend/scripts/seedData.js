const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

/**
 * Upserts ONLY the seller account from .env.
 * Buyers register at /register (role: user). Sellers sign in at the same /login.
 * Does not delete existing buyers, catalog, or orders.
 */
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore');
    console.log('Connected to MongoDB');

    const sellerEmail = process.env.SELLER_EMAIL;
    const sellerPassword = process.env.SELLER_PASSWORD;
    const sellerName = process.env.SELLER_NAME || 'BooksBin Seller';

    if (!sellerEmail || !sellerPassword) {
      throw new Error('SELLER_EMAIL and SELLER_PASSWORD must be set in .env');
    }

    const normalizedEmail = sellerEmail.toLowerCase().trim();
    let seller = await User.findOne({ email: normalizedEmail });

    if (seller) {
      seller.name = sellerName;
      seller.password = sellerPassword;
      seller.role = 'seller';
      seller.isEmailVerified = true;
      seller.isActive = true;
      await seller.save();
      console.log('Updated existing seller account');
    } else {
      seller = new User({
        name: sellerName,
        email: normalizedEmail,
        password: sellerPassword,
        role: 'seller',
        isEmailVerified: true,
        isActive: true,
      });
      await seller.save();
      console.log('Created seller account');
    }

    console.log('\nSeed completed successfully!');
    console.log(`Seller login: ${normalizedEmail}`);
    console.log('Password:     (value of SELLER_PASSWORD in .env)');
    console.log('\nSign in at /login — buyers and seller use the same page.');
    console.log('Seller dashboard: /seller/dashboard after login.');
    console.log('Buyers: register at /register on the website.');
  } catch (error) {
    console.error('Seed data error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
