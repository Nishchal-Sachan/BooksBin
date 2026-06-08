import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  BookOpen,
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Settings,
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import PageContainer from './PageContainer'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

const navLinks = [
  { to: '/seller/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/seller/books', label: 'Catalog', icon: BookOpen, end: true },
  { to: '/seller/orders', label: 'Orders', icon: Package, end: true },
  { to: '/seller/books/add', label: 'Add product', icon: PlusCircle, end: true },
]

export default function SellerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-100 text-primary-900'
        : 'text-ink-muted hover:bg-surface-subtle hover:text-primary-800'
    )

  const initials = (user?.name || 'S')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-nav">
      <PageContainer>
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <Link to="/seller/dashboard" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="font-serif text-xl text-ink">BooksBin</span>
              <span className="block text-small font-semibold uppercase tracking-wide text-primary-700">
                Seller portal
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Seller">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-small font-bold text-primary-900">
                {initials}
              </div>
              <span className="max-w-[10rem] truncate text-body-sm font-semibold text-ink">
                {user?.name}
              </span>
            </div>
            <Button as={Link} to="/seller/settings" variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <button
              type="button"
              className="rounded-lg p-2 text-ink-muted hover:bg-surface-subtle lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-neutral-200 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <NavLink to="/seller/settings" className={linkClass} onClick={() => setMenuOpen(false)}>
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
              <button type="button" onClick={handleLogout} className={cn(linkClass({ isActive: false }), 'w-full text-left')}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </PageContainer>
    </header>
  )
}
