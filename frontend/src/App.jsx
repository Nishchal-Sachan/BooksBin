import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './store/slices/authSlice'
import { getCart, clearCartState } from './store/slices/cartSlice'

// Layout components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public pages
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import Search from './pages/Search'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'

// Protected pages
import UserDashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import Addresses from './pages/user/Addresses'
import Orders from './pages/user/Orders'
import Unauthorized from './pages/Unauthorized'
import OrderDetail from './pages/user/OrderDetail'
import Wishlist from './pages/user/Wishlist'
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import OrderSuccess from './pages/user/OrderSuccess'
import MyReviews from './pages/user/MyReviews'

// Seller pages
import SellerDashboard from './pages/seller/Dashboard'
import SellerBooks from './pages/seller/Books'
import SellerOrders from './pages/seller/Orders'
import AddBook from './pages/seller/AddBook'
import EditBook from './pages/seller/EditBook'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminBooks from './pages/admin/Books'
import AdminOrders from './pages/admin/Orders'

// Protected route component
import ProtectedRoute from './components/auth/ProtectedRoute'
import PageContainer from './components/layout/PageContainer'
import Spinner from './components/ui/Spinner'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart())
    } else {
      dispatch(clearCartState())
    }
  }, [dispatch, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected user routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:orderId"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* Seller routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/books"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/books/add"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <AddBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/books/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <EditBook />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route
            path="*"
            element={
              <div className="section-y bg-surface-subtle">
                <PageContainer className="py-20 text-center">
                  <h1 className="text-h1">Page not found</h1>
                  <p className="mt-3 text-body text-ink-muted">
                    The page you are looking for does not exist.
                  </p>
                </PageContainer>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
