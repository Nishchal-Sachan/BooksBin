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
  Package,
  LayoutGrid,
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import { isBuyer } from '../../utils/roles'
import PageContainer from './PageContainer'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQueryLocal] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)

  const showShopperTools = !isAuthenticated || isBuyer(user)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const getInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const navLinkClass =
    'flex items-center gap-3 rounded-lg px-4 py-2.5 text-body-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-primary-800'

  const shopLinks = [
    { to: '/books', label: 'Shop' },
    { to: '/books?sort=bestseller', label: 'Bestsellers' },
    { to: '/books?sort=newest', label: 'New arrivals' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-nav">
      <PageContainer>
        <div className="flex h-[4.25rem] items-center gap-3 lg:gap-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800 text-white">
              <BookOpen className="h-5 w-5" aria-hidden />
            </div>
            <span className="font-serif text-xl font-normal tracking-tight text-ink">
              BooksBin
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {shopLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="rounded-lg px-3.5 py-2 text-body-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-primary-800"
              >
                {label}
              </Link>
            ))}
          </div>

          <form
            onSubmit={handleSearch}
            className="mx-auto hidden min-w-0 max-w-lg flex-1 md:block"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search books, authors, ISBN…"
                value={searchQuery}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="input-field w-full py-2.5 pl-10 pr-4"
                aria-label="Search books"
              />
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
                aria-hidden
              />
            </div>
          </form>

          <div className="flex flex-1 items-center justify-end gap-0.5 md:flex-none md:gap-1">
            {showShopperTools && (
              <>
                <Link
                  to="/cart"
                  className="relative rounded-lg p-2.5 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-primary-800"
                  aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-small font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/wishlist"
                    className="rounded-lg p-2.5 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-primary-800"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-6 w-6" />
                  </Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-1.5 pr-2 text-ink-muted transition-colors hover:bg-surface-subtle"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 ring-2 ring-primary-200">
                    <span className="text-small font-bold text-primary-900">
                      {getInitials(user?.name || 'U')}
                    </span>
                  </div>
                  <span className="hidden max-w-[8rem] truncate text-body-sm font-semibold text-ink lg:inline">
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-elevated">
                    {showShopperTools && (
                      <>
                        <Link to="/account" className={navLinkClass} onClick={() => setIsUserMenuOpen(false)}>
                          <LayoutGrid className="h-4 w-4" />
                          My account
                        </Link>
                        <Link to="/orders" className={navLinkClass} onClick={() => setIsUserMenuOpen(false)}>
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                        <Link to="/profile" className={navLinkClass} onClick={() => setIsUserMenuOpen(false)}>
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link to="/wishlist" className={navLinkClass} onClick={() => setIsUserMenuOpen(false)}>
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                      </>
                    )}
                    <button type="button" onClick={handleLogout} className={cn(navLinkClass, 'w-full border-t border-neutral-200 text-left')}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link to="/login" className="hidden rounded-lg px-3 py-2 text-body-sm font-semibold text-ink-muted hover:text-primary-800 sm:inline">
                  Sign in
                </Link>
                <Button as={Link} to="/register" size="sm">
                  Join free
                </Button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-ink-muted hover:bg-surface-subtle md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="border-t border-neutral-200 pb-4 pt-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search books…"
                value={searchQuery}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="input-field w-full py-2.5 pl-10 pr-4"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
            </div>
          </form>
        </div>

        {isMenuOpen && (
          <div className="border-t border-neutral-200 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {shopLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                  {label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link to="/login" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                  Sign in
                </Link>
              )}
              {isAuthenticated && showShopperTools && (
                <>
                  <Link to="/account" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>My account</Link>
                  <Link to="/orders" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Orders</Link>
                  <button type="button" onClick={() => { handleLogout(); setIsMenuOpen(false) }} className={navLinkClass}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </PageContainer>
    </nav>
  )
}

export default Navbar
