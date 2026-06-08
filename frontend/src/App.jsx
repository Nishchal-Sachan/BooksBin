import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './store/slices/authSlice'
import { getCart, clearCartState } from './store/slices/cartSlice'
import { isBuyer } from './utils/roles'

// Layout components
import Navbar from './components/layout/Navbar'
import SellerNavbar from './components/layout/SellerNavbar'
import AdminNavbar from './components/layout/AdminNavbar'
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
import SellerSettings from './pages/seller/Settings'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminBooks from './pages/admin/Books'
import AdminOrders from './pages/admin/Orders'

// Protected route component
import ProtectedRoute from './components/auth/ProtectedRoute'
import BuyerOnlyRoute from './components/auth/BuyerOnlyRoute'
import StorefrontGuard from './components/auth/StorefrontGuard'
import PageContainer from './components/layout/PageContainer'
import Spinner from './components/ui/Spinner'

function AppShell() {
  const location = useLocation()
  const isSellerPortal = location.pathname.startsWith('/seller')
  const isAdminPortal = location.pathname.startsWith('/admin')
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].some(
    (p) => location.pathname.startsWith(p)
  )
  const showStorefrontChrome = !isSellerPortal && !isAdminPortal

  if (isSellerPortal) return <SellerNavbar />
  if (isAdminPortal) return <AdminNavbar />
  if (isAuthPage) return null
  return <Navbar />
}

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)
  const isSellerPortal = location.pathname.startsWith('/seller')
  const isAdminPortal = location.pathname.startsWith('/admin')

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && isBuyer(user)) {
      dispatch(getCart())
    } else {
      dispatch(clearCartState())
    }
  }, [dispatch, isAuthenticated, user])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppShell />
      <main className="flex-1 w-full">
        <Routes>
          {/* Storefront — shoppers only; sellers/admins go to their portal */}
          <Route path="/" element={<StorefrontGuard><Home /></StorefrontGuard>} />
          <Route path="/books" element={<StorefrontGuard><Books /></StorefrontGuard>} />
          <Route path="/books/:id" element={<StorefrontGuard><BookDetail /></StorefrontGuard>} />
          <Route path="/search" element={<StorefrontGuard><Search /></StorefrontGuard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Buyer account & checkout — not for sellers */}
          <Route path="/account" element={<BuyerOnlyRoute><UserDashboard /></BuyerOnlyRoute>} />
          <Route path="/profile" element={<BuyerOnlyRoute><Profile /></BuyerOnlyRoute>} />
          <Route path="/addresses" element={<BuyerOnlyRoute><Addresses /></BuyerOnlyRoute>} />
          <Route path="/orders/:orderId" element={<BuyerOnlyRoute><OrderDetail /></BuyerOnlyRoute>} />
          <Route path="/orders" element={<BuyerOnlyRoute><Orders /></BuyerOnlyRoute>} />
          <Route path="/wishlist" element={<BuyerOnlyRoute><Wishlist /></BuyerOnlyRoute>} />
          <Route path="/my-reviews" element={<BuyerOnlyRoute><MyReviews /></BuyerOnlyRoute>} />
          <Route path="/cart" element={<BuyerOnlyRoute><Cart /></BuyerOnlyRoute>} />
          <Route path="/checkout" element={<BuyerOnlyRoute><Checkout /></BuyerOnlyRoute>} />
          <Route path="/order-success/:orderId" element={<BuyerOnlyRoute><OrderSuccess /></BuyerOnlyRoute>} />

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
          <Route
            path="/seller/settings"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerSettings />
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
      {!isSellerPortal && !isAdminPortal && <Footer />}
    </div>
  )
}

export default App
