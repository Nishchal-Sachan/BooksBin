const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Book = require('../models/Book');

// Use a separate database for testing
const TEST_DB_URI = 'mongodb://127.0.0.1:27017/bookstore_test';

describe('Books API', () => {
    beforeEach(async () => {
        // Seed a book
        await Book.create({
            title: 'Test Book',
            author: 'Test Author',
            description: 'Test Description',
            price: 29.99,
            category: 'fiction',
            isbn: '978-3-16-148410-0',
            stock: 10,
            seller: new mongoose.Types.ObjectId(), // Mock seller ID
            imageUrl: 'http://example.com/image.jpg'
        });
    });

    afterEach(async () => {
        await Book.deleteMany({});
    });

    it('should get all books', async () => {
        const res = await request(app).get('/api/books');
        expect(res.statusCode).toEqual(200);
        expect(res.body.books).toBeInstanceOf(Array);
        expect(res.body.books.length).toBeGreaterThan(0);
    });

    it('should get a book by ID', async () => {
        const book = await Book.findOne({ title: 'Test Book' });
        const res = await request(app).get(`/api/books/${book._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Test Book');
    });
});
