const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = new User({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    const seller1 = new User({
      name: 'John Seller',
      email: 'john@bookstore.com',
      password: 'seller123',
      role: 'seller',
      isEmailVerified: true,
      isActive: true
    });

    const seller2 = new User({
      name: 'Jane Bookseller',
      email: 'jane@bookstore.com',
      password: 'seller123',
      role: 'seller',
      isEmailVerified: true,
      isActive: true
    });

    const customer1 = new User({
      name: 'Alice Customer',
      email: 'alice@bookstore.com',
      password: 'customer123',
      role: 'user',
      isEmailVerified: true,
      isActive: true
    });

    const customer2 = new User({
      name: 'Bob Reader',
      email: 'bob@bookstore.com',
      password: 'customer123',
      role: 'user',
      isEmailVerified: true,
      isActive: true
    });

    await Promise.all([admin.save(), seller1.save(), seller2.save(), customer1.save(), customer2.save()]);
    console.log('Created users');

    // Create books
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
        category: 'fiction',
        price: 12.99,
        originalPrice: 15.99,
        stock: 50,
        condition: 'new',
        seller: seller1._id,
        publisher: 'Scribner',
        publishedDate: new Date('1925-04-10'),
        language: 'English',
        pages: 180,
        tags: ['classic', 'american literature', 'jazz age'],
        isFeatured: true,
        images: [{
          url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
          isPrimary: true
        }]
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
        category: 'fiction',
        price: 14.99,
        originalPrice: 18.99,
        stock: 30,
        condition: 'new',
        seller: seller1._id,
        publisher: 'J.B. Lippincott & Co.',
        publishedDate: new Date('1960-07-11'),
        language: 'English',
        pages: 281,
        tags: ['classic', 'american literature', 'social justice'],
        isFeatured: true,
        images: [{
          url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
          isPrimary: true
        }]
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        description: 'A dystopian social science fiction novel about totalitarian control and surveillance.',
        category: 'sci-fi',
        price: 13.99,
        originalPrice: 16.99,
        stock: 25,
        condition: 'new',
        seller: seller2._id,
        publisher: 'Secker & Warburg',
        publishedDate: new Date('1949-06-08'),
        language: 'English',
        pages: 328,
        tags: ['dystopian', 'science fiction', 'political'],
        isFeatured: true,
        images: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          isPrimary: true
        }]
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '9780141439518',
        description: 'A romantic novel of manners that critiques the British landed gentry of the early 19th century.',
        category: 'romance',
        price: 11.99,
        originalPrice: 14.99,
        stock: 40,
        condition: 'new',
        seller: seller2._id,
        publisher: 'T. Egerton, Whitehall',
        publishedDate: new Date('1813-01-28'),
        language: 'English',
        pages: 432,
        tags: ['romance', 'classic', 'british literature'],
        isFeatured: true,
        images: [{
          url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
          isPrimary: true
        }]
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '9780316769174',
        description: 'A coming-of-age story about teenage rebellion and alienation in post-war America.',
        category: 'fiction',
        price: 13.49,
        originalPrice: 15.99,
        stock: 35,
        condition: 'new',
        seller: seller1._id,
        publisher: 'Little, Brown and Company',
        publishedDate: new Date('1951-07-16'),
        language: 'English',
        pages: 277,
        tags: ['coming of age', 'american literature', 'teenage'],
        isFeatured: false,
        images: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          isPrimary: true
        }]
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        isbn: '9780544003415',
        description: 'An epic high-fantasy novel about the quest to destroy the One Ring.',
        category: 'fantasy',
        price: 19.99,
        originalPrice: 24.99,
        stock: 20,
        condition: 'new',
        seller: seller2._id,
        publisher: 'Allen & Unwin',
        publishedDate: new Date('1954-07-29'),
        language: 'English',
        pages: 1216,
        tags: ['fantasy', 'epic', 'adventure'],
        isFeatured: true,
        images: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          isPrimary: true
        }]
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928227',
        description: 'A fantasy novel about a hobbit who goes on an unexpected journey.',
        category: 'fantasy',
        price: 15.99,
        originalPrice: 19.99,
        stock: 30,
        condition: 'new',
        seller: seller2._id,
        publisher: 'Allen & Unwin',
        publishedDate: new Date('1937-09-21'),
        language: 'English',
        pages: 310,
        tags: ['fantasy', 'adventure', 'children'],
        isFeatured: false,
        images: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          isPrimary: true
        }]
      },
      {
        title: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        isbn: '9780064471190',
        description: 'A series of seven fantasy novels about children who discover the magical world of Narnia.',
        category: 'children',
        price: 22.99,
        originalPrice: 28.99,
        stock: 15,
        condition: 'new',
        seller: seller1._id,
        publisher: 'Geoffrey Bles',
        publishedDate: new Date('1950-10-16'),
        language: 'English',
        pages: 767,
        tags: ['fantasy', 'children', 'adventure'],
        isFeatured: true,
        images: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          isPrimary: true
        }]
      }
    ];

    const createdBooks = await Book.insertMany(books);
    console.log('Created books');

    // Create some reviews
    const reviews = [
      {
        user: customer1._id,
        book: createdBooks[0]._id,
        order: new mongoose.Types.ObjectId(), // Mock order ID
        rating: 5,
        title: 'Amazing classic!',
        comment: 'This book is a timeless masterpiece. The writing is beautiful and the story is captivating.',
        isVerified: true
      },
      {
        user: customer2._id,
        book: createdBooks[0]._id,
        order: new mongoose.Types.ObjectId(), // Mock order ID
        rating: 4,
        title: 'Great read',
        comment: 'Really enjoyed this book. The characters are well-developed and the plot is engaging.',
        isVerified: true
      },
      {
        user: customer1._id,
        book: createdBooks[1]._id,
        order: new mongoose.Types.ObjectId(), // Mock order ID
        rating: 5,
        title: 'Powerful story',
        comment: 'This book tackles important themes and is beautifully written. Highly recommended.',
        isVerified: true
      },
      {
        user: customer2._id,
        book: createdBooks[2]._id,
        order: new mongoose.Types.ObjectId(), // Mock order ID
        rating: 5,
        title: 'Thought-provoking',
        comment: 'A chilling look at totalitarianism. Still relevant today.',
        isVerified: true
      }
    ];

    await Review.insertMany(reviews);
    console.log('Created reviews');

    // Update book ratings
    for (const book of createdBooks) {
      await Review.updateBookRatings(book._id);
    }

    console.log('Seed data created successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@bookstore.com / admin123');
    console.log('Seller 1: john@bookstore.com / seller123');
    console.log('Seller 2: jane@bookstore.com / seller123');
    console.log('Customer 1: alice@bookstore.com / customer123');
    console.log('Customer 2: bob@bookstore.com / customer123');

  } catch (error) {
    console.error('Seed data error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seed data if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
