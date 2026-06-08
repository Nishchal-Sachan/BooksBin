import { Link } from 'react-router-dom'
import { BookOpen, Truck, Banknote, ShieldCheck } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants'

const perks = [
  { icon: Truck, text: `Free delivery over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: Banknote, text: 'Cash on delivery nationwide' },
  { icon: ShieldCheck, text: 'Authentic editions & secure checkout' },
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-surface-subtle">
      {/* Editorial brand panel */}
      <aside className="auth-brand-panel" aria-hidden={false}>
        <div className="auth-brand-pattern" aria-hidden />
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-2xl tracking-tight text-white">BooksBin</span>
          </Link>
          <p className="mt-10 max-w-sm font-serif text-3xl font-normal leading-snug text-white/95 xl:text-4xl">
            Stories worth holding.
            <span className="mt-2 block text-lg font-sans font-normal text-white/70">
              Books, art prints & stationery — curated for readers across India.
            </span>
          </p>
        </div>

        <ul className="relative z-10 mt-auto space-y-4 pt-12">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-small text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Icon className="h-4 w-4 text-accent-300" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <p className="relative z-10 mt-10 font-serif text-sm italic text-white/40">
          “A room without books is like a body without a soul.” — Cicero
        </p>
      </aside>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl text-ink">BooksBin</span>
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">{subtitle}</p>
            )}
          </header>

          {children}

          {footer && <div className="mt-8 border-t border-neutral-200 pt-6">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
