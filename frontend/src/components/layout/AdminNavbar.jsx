import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, LayoutDashboard, Users, Package, LogOut } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import PageContainer from './PageContainer'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users', end: true },
  { to: '/admin/books', label: 'Catalog', end: true },
  { to: '/admin/orders', label: 'Orders', end: true },
]

export default function AdminNavbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const linkClass = ({ isActive }) =>
    cn(
      'rounded-lg px-3 py-2 text-body-sm font-medium transition-colors',
      isActive ? 'bg-primary-100 text-primary-900' : 'text-ink-muted hover:text-primary-800'
    )

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-nav">
      <PageContainer className="flex h-[4.25rem] items-center justify-between gap-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl text-ink">BooksBin Admin</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-body-sm font-medium text-ink-muted sm:inline">{user?.name}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(logout())
              navigate('/login')
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </PageContainer>
    </header>
  )
}
