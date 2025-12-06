const mongoose = require('mongoose');
const User = require('./models/User');

const TEST_DB_URI = 'mongodb://localhost:27017/bookstore_test';

async function testConnection() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(TEST_DB_URI);
        console.log('Connected!');

        console.log('Creating user...');
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('User created:', user.email);

        console.log('Finding user...');
        const found = await User.findOne({ email: 'test@example.com' });
        console.log('User found:', found.email);

        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error);
    }
}

testConnection();
