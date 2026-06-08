import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  User,
  Package,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import PageContainer from '../layout/PageContainer'
import { cn } from '../../utils/cn'

const nav = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/orders', label: 'Orders', icon: Package, end: false },
  { to: '/my-reviews', label: 'My reviews', icon: MessageSquare },
  { to: '/addresses', label: 'Addresses', icon: MapPin },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
]

export default function AccountLayout({
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-6xl',
}) {
  const user = useSelector((s) => s.auth.user)

  const initials = (user?.name || user?.email || '?')
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors',
      isActive
        ? 'nav-active'
        : 'text-ink-muted hover:bg-neutral-100 hover:text-ink'
    )

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer className={maxWidthClass}>
        <div className="mb-8 flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              My account
            </p>
            <h1 className="mt-2 text-h1 md:text-display">{title}</h1>
            {subtitle ? (
              <p className="mt-2 max-w-xl text-body-sm text-ink-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-soft">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-800 text-small font-bold text-white shadow-soft"
              aria-hidden
            >
              {initials.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">
                {user?.name || 'Reader'}
              </p>
              <p className="truncate text-small text-ink-muted">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-3">
            <nav
              className="space-y-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-soft lg:sticky lg:top-24"
              aria-label="Account"
            >
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/account' || to === '/profile' || to === '/my-reviews' || end}
                  className={linkClass}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <div className="lg:col-span-9">{children}</div>
        </div>
      </PageContainer>
    </div>
  )
}
