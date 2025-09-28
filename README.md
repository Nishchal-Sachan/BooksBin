# BookStore E-Commerce Platform

A complete, production-ready e-commerce platform for selling books with customer, seller, and admin features. Built with Node.js (Express + MongoDB) for the backend and React (Vite + Tailwind CSS) for the frontend.

## 🚀 Features

### 👤 Customer Features
- **Browse & Search**: Browse all books with advanced filters (title, author, category, price, rating)
- **Book Details**: View detailed book pages with reviews, ratings, and seller information
- **Shopping Cart**: Add books to cart and manage quantities
- **Checkout**: Secure payment processing with Stripe integration
- **Order Tracking**: Track order status (pending, shipped, delivered, cancelled)
- **Profile Management**: Manage personal information and addresses
- **Wishlist**: Save favorite books for later purchase
- **Reviews & Ratings**: Submit reviews and ratings for purchased books

### 👨‍💻 Seller Features
- **Seller Registration**: Role-based authentication for sellers
- **Book Management**: List books with complete details (title, author, ISBN, description, price, stock, condition)
- **Image Upload**: Upload cover images (configured for AWS S3 or local storage)
- **Inventory Management**: Update, delete, and manage listed books
- **Order Management**: View and manage orders received for their books
- **Sales Analytics**: Track sales performance and revenue
- **Dashboard**: Comprehensive seller dashboard with statistics

### 👑 Admin Features
- **Admin Dashboard**: Overview of sales, orders, and users
- **User Management**: Manage all users (activate/deactivate, assign roles)
- **Book Management**: CRUD operations for all books
- **Order Management**: Manage all orders across the platform
- **Seller Approval**: Approve/reject seller registrations
- **Analytics**: Comprehensive analytics and reporting

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **Bcrypt** for password hashing
- **Stripe** for payment processing
- **Multer** for file uploads
- **Cloudinary** for image management
- **Express Validator** for input validation
- **Helmet** for security
- **Rate Limiting** for API protection

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Redux Toolkit** for state management
- **React Query** for data fetching
- **React Hook Form** with Zod validation
- **Stripe Elements** for checkout
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📁 Project Structure

```
bookstore/
├── backend/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── scripts/          # Database seeding
│   └── server.js         # Express server
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main app component
│   └── public/           # Static assets
├── env.example           # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookstore
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp env.example .env
   cp frontend/env.example frontend/.env
   
   # Edit .env files with your credentials
   nano .env
   nano frontend/.env
   ```

4. **Configure Environment Variables**

   **Backend (.env):**
   ```env
   NODE_ENV=development
   PORT=4000
   MONGO_URI=your_mongodb_uri_here
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   STRIPE_SECRET_KEY=your_stripe_secret_here
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
   ```

   **Frontend (frontend/.env):**
   ```env
   VITE_API_URL=http://localhost:4000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

5. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the Application**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - API Health Check: http://localhost:4000/api/health

## 🔐 Demo Accounts

After seeding the database, you can use these demo accounts:

- **Admin**: admin@bookstore.com / admin123
- **Seller**: john@bookstore.com / seller123
- **Customer**: alice@bookstore.com / customer123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - User logout

### Book Endpoints
- `GET /api/books` - Get all books with filters
- `GET /api/books/featured` - Get featured books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (seller/admin)
- `PUT /api/books/:id` - Update book (seller/admin)
- `DELETE /api/books/:id` - Delete book (seller/admin)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:bookId` - Remove from cart

### Payment Endpoints
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/confirm-payment` - Confirm payment
- `POST /api/payment/webhook` - Stripe webhook handler

## 🎨 Frontend Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive navigation and layouts
- Touch-friendly interface

### State Management
- Redux Toolkit for global state
- React Query for server state
- Local state with React hooks

### Form Handling
- React Hook Form for form management
- Zod for validation schemas
- Real-time validation feedback

### User Experience
- Loading states and error handling
- Toast notifications
- Protected routes with role-based access
- Search and filtering capabilities

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet for security headers
- Role-based access control

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

### Environment Variables for Production
Ensure all environment variables are properly configured in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the demo accounts for testing

## 🔄 Future Enhancements

- Real-time notifications with WebSockets
- Advanced search with Elasticsearch
- Mobile app with React Native
- Multi-language support
- Advanced analytics dashboard
- Email notifications
- Social login integration
- Advanced inventory management
- Bulk operations for sellers
- Advanced reporting features

---

**Note**: This is a production-ready e-commerce platform. Make sure to configure all environment variables properly and follow security best practices when deploying to production.
