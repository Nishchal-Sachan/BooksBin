import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  BookOpen,
  LogOut,
  Settings,
  Package,
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import { setSearchQuery } from '../../store/slices/uiSlice'
import PageContainer from './PageContainer'
import Button from '../ui/Button'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQueryLocal] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(setSearchQuery(searchQuery))
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const navLinkClass =
    'flex items-center gap-3 rounded-lg px-4 py-2.5 text-body-sm text-neutral-600 transition-colors hover:bg-surface-subtle hover:text-primary-600'

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/90 bg-surface/90 shadow-soft backdrop-blur-md">
      <PageContainer>
        <div className="flex h-16 items-center gap-3 lg:gap-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-90"
          >
            <BookOpen className="h-8 w-8 text-primary-600" aria-hidden />
            <span className="text-h3 font-bold tracking-tight text-neutral-900">
              BooksBin
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search books, authors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="input-field w-full py-2.5 pl-10 pr-4"
                aria-label="Search books"
              />
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
            </div>
          </form>

          <div className="flex flex-1 items-center justify-end gap-0.5 md:flex-none md:gap-1">
            <Link
              to="/cart"
              className="relative rounded-lg p-2.5 text-neutral-500 transition-colors hover:bg-surface-subtle hover:text-primary-600"
              aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-small font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              className="rounded-lg p-2.5 text-neutral-500 transition-colors hover:bg-surface-subtle hover:text-primary-600"
              aria-label="Wishlist"
            >
              <Heart className="h-6 w-6" />
            </Link>

            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-1.5 pr-2 text-neutral-600 transition-colors hover:bg-surface-subtle hover:text-primary-600"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {user?.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-neutral-100"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 ring-2 ring-primary-100">
                      <span className="text-small font-semibold text-primary-700">
                        {getInitials(user?.name || 'U')}
                      </span>
                    </div>
                  )}
                  <span className="hidden max-w-[8rem] truncate text-body-sm font-medium lg:inline">
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200/90 bg-surface py-1 shadow-elevated animate-fade-in">
                    <Link
                      to="/profile"
                      className={navLinkClass}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 shrink-0" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className={navLinkClass}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 shrink-0" />
                      Orders
                    </Link>
                    {user?.role === 'buyer' && (
                      <Link
                        to="/wishlist"
                        className={navLinkClass}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4 shrink-0" />
                        Wishlist
                      </Link>
                    )}

                    {user?.role === 'seller' && (
                      <>
                        <Link
                          to="/seller/dashboard"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 shrink-0" />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/books"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 shrink-0" />
                          Manage Books
                        </Link>
                        <Link
                          to="/seller/books/add"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 shrink-0" />
                          Add Book
                        </Link>
                        <Link
                          to="/seller/orders"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4 shrink-0" />
                          Seller Orders
                        </Link>
                      </>
                    )}

                    {user?.role === 'admin' && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 shrink-0" />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 shrink-0" />
                          Manage Users
                        </Link>
                        <Link
                          to="/admin/books"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 shrink-0" />
                          Manage Books
                        </Link>
                        <Link
                          to="/admin/orders"
                          className={navLinkClass}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4 shrink-0" />
                          Manage Orders
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`${navLinkClass} w-full border-t border-neutral-100 text-left`}
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden rounded-lg px-3 py-2 text-body-sm font-medium text-neutral-600 transition-colors hover:text-primary-600 sm:inline"
                >
                  Login
                </Link>
                <Button as={Link} to="/register" size="sm" className="whitespace-nowrap">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-neutral-600 hover:bg-surface-subtle"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-neutral-100 pb-4 pt-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="input-field w-full py-2.5 pl-10 pr-4"
                aria-label="Search books"
              />
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
            </div>
          </form>
        </div>

        {isMenuOpen && (
          <div className="border-t border-neutral-200 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 shrink-0" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="h-5 w-5 shrink-0" />
                    Orders
                  </Link>
                  {user?.role === 'buyer' && (
                    <Link
                      to="/wishlist"
                      className={navLinkClass}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 shrink-0" />
                      Wishlist
                    </Link>
                  )}
                  {user?.role === 'seller' && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 shrink-0" />
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/seller/books"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpen className="h-5 w-5 shrink-0" />
                        Manage Books
                      </Link>
                      <Link
                        to="/seller/books/add"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpen className="h-5 w-5 shrink-0" />
                        Add Book
                      </Link>
                      <Link
                        to="/seller/orders"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package className="h-5 w-5 shrink-0" />
                        Seller Orders
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 shrink-0" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/users"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5 shrink-0" />
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/books"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpen className="h-5 w-5 shrink-0" />
                        Manage Books
                      </Link>
                      <Link
                        to="/admin/orders"
                        className={navLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package className="h-5 w-5 shrink-0" />
                        Manage Orders
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className={navLinkClass}
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    Logout
                  </button>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/register"
                  className="mt-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        )}
      </PageContainer>
    </nav>
  )
}

export default Navbar
