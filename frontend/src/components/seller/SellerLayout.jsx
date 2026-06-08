import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Package,
  PlusCircle,
  Settings,
  Store,
} from 'lucide-react'
import PageContainer from '../layout/PageContainer'
import { cn } from '../../utils/cn'

const nav = [
  {
    to: '/seller/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    end: true,
  },
  { to: '/seller/books', label: 'Catalog', icon: BookOpen, end: true },
  { to: '/seller/orders', label: 'Orders', icon: Package, end: true },
  { to: '/seller/books/add', label: 'Add product', icon: PlusCircle, end: true },
  { to: '/seller/settings', label: 'Settings', icon: Settings, end: true },
]

export default function SellerLayout({ title, subtitle, children }) {
  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors',
      isActive
        ? 'nav-active'
        : 'text-ink-muted hover:bg-neutral-100 hover:text-ink'
    )

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer className="max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <Store className="h-4 w-4" aria-hidden />
              Seller hub
            </p>
            <h1 className="mt-2 text-h1 md:text-display">{title}</h1>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-body-sm text-ink-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-3">
            <nav
              className="space-y-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-soft lg:sticky lg:top-24"
              aria-label="Seller"
            >
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} className={linkClass} end={end}>
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
