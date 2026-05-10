import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Star,
  Quote,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  BookMarked,
  Library,
  Sparkles,
  GraduationCap,
  UserRound,
  Atom,
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import HeroIllustration from '../components/landing/HeroIllustration'
import { formatPrice } from '../utils/format'
import {
  TRUST_STATS,
  MOCK_FEATURED_BOOKS,
  CATEGORY_CARDS,
  WHY_FEATURES,
  TESTIMONIALS,
} from '../data/landingMock'
import { cn } from '../utils/cn'

const CATEGORY_ICONS = {
  fiction: BookMarked,
  'non-fiction': Library,
  'self-help': Sparkles,
  academic: GraduationCap,
  biography: UserRound,
  science: Atom,
}

const WHY_ICONS = [Tag, ShieldCheck, Truck, RotateCcw]

function StarRow({ rating }) {
  const full = Math.floor(rating)
  const partial = rating - full >= 0.5
  return (
    <div className="flex items-center gap-0.5 text-amber-500" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && partial
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-neutral-100 text-neutral-200'
          )}
        />
      ))}
    </div>
  )
}

function FeaturedBookCard({ book }) {
  return (
    <article className="group relative w-[min(100%,280px)] shrink-0 snap-start sm:w-[260px]">
      <Link
        to="/books"
        className="block overflow-hidden rounded-2xl border border-neutral-200/90 bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/80 hover:shadow-elevated"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <StarRow rating={book.rating} />
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-small font-semibold text-neutral-800 shadow-soft tabular-nums">
              {book.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-body font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-primary-700">
            {book.title}
          </h3>
          <p className="mt-1 text-small text-neutral-500">{book.author}</p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <span className="text-lg font-bold tracking-tight text-primary-600">
              {formatPrice(book.price)}
            </span>
            <span className="text-small text-neutral-400">
              {book.reviewCount.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

const Home = () => {
  useEffect(() => {
    document.title = 'BooksBin — Buy & sell books without the friction'
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      {/* —— Hero —— */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-[#2a3d38] pb-16 pt-12 text-white md:pb-24 md:pt-16 lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-secondary-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl"
          aria-hidden
        />

        <PageContainer className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-small font-medium text-primary-100 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live listings · New sellers weekly
              </p>
              <h1 className="mt-6 text-[2rem] font-semibold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                Where every book finds its{' '}
                <span className="bg-gradient-to-r from-primary-100 to-secondary-200 bg-clip-text text-transparent">
                  next reader
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-100/90 sm:text-xl sm:leading-relaxed">
                Buy curated reads at fair prices—or list what you have finished
                and ship from your doorstep. One marketplace for readers who buy
                smart and sell simple.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button as={Link} to="/books" size="lg" variant="inverse">
                  Explore books
                </Button>
                <Button as={Link} to="/register" size="lg" variant="outlineInverse">
                  Start selling
                </Button>
              </div>
              <p className="mt-6 text-small text-primary-200/80">
                No storefront setup drama. List in minutes · Buyer protection on
                every order
              </p>
            </div>
            <HeroIllustration className="lg:justify-self-end" />
          </div>
        </PageContainer>
      </section>

      {/* —— Trust —— */}
      <section className="relative border-y border-neutral-200/80 bg-gradient-to-b from-surface-subtle to-surface py-14 md:py-16">
        <PageContainer>
          <p className="text-center text-small font-semibold uppercase tracking-widest text-primary-600">
            Trusted by readers & sellers
          </p>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-surface p-8 text-center shadow-soft"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-100/50" />
                <p className="font-mono text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-h3 text-neutral-800">{stat.label}</p>
                <p className="mt-1 text-small text-neutral-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* —— Featured books —— */}
      <section className="section-y bg-surface">
        <PageContainer>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-h1 md:text-display">Trending on BooksBin</h2>
              <p className="mt-2 max-w-xl text-body text-neutral-600">
                Hand-picked titles readers are adding to cart—fiction,
                non-fiction, and everything between.
              </p>
            </div>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 self-start text-body-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              See full catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-surface to-transparent sm:w-12" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-surface to-transparent sm:w-12" />
            <div className="scrollbar-landing -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-1 sm:-mx-6 sm:gap-5 sm:px-6 md:gap-6">
              {MOCK_FEATURED_BOOKS.map((book) => (
                <FeaturedBookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-small text-neutral-500 sm:text-left">
            Swipe on mobile · Covers shown are representative of popular titles
          </p>
        </PageContainer>
      </section>

      {/* —— Categories —— */}
      <section className="section-y border-t border-neutral-100 bg-surface-subtle">
        <PageContainer>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-h1 md:text-display">Shop by category</h2>
            <p className="mt-3 text-body text-neutral-600">
              Jump straight into the section that matches your mood—or your
              syllabus.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_CARDS.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Library
              return (
                <Link
                  key={cat.slug}
                  to={`/books?category=${encodeURIComponent(cat.slug)}`}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-surface p-6 shadow-soft ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card',
                    'bg-gradient-to-br',
                    cat.accent,
                    cat.ring
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-h3 text-neutral-900">{cat.label}</h3>
                      <p className="mt-1 text-body-sm text-neutral-600">
                        {cat.description}
                      </p>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-soft ring-1 ring-neutral-200/80 transition-transform duration-300 group-hover:scale-105 group-hover:ring-primary-200">
                      <Icon className="h-7 w-7 text-primary-600" />
                    </div>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 text-small font-semibold text-primary-600">
                    Browse {cat.label.toLowerCase()}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* —— Why us —— */}
      <section className="section-y bg-surface">
        <PageContainer>
          <div className="mb-12 text-center md:mb-14">
            <h2 className="text-h1 md:text-display">Why readers choose us</h2>
            <p className="mx-auto mt-3 max-w-2xl text-body text-neutral-600">
              Built for people who love books—not for endless scrolling through
              questionable listings.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {WHY_FEATURES.map((f, i) => {
              const Icon = WHY_ICONS[i]
              return (
                <div
                  key={f.title}
                  className="flex gap-5 rounded-2xl border border-neutral-100 bg-gradient-to-br from-surface to-surface-subtle p-6 shadow-soft transition-card hover:border-primary-100 hover:shadow-card md:p-8"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-card">
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-h3">{f.title}</h3>
                    <p className="mt-2 text-body-sm leading-relaxed text-neutral-600">
                      {f.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* —— Testimonials —— */}
      <section className="section-y border-t border-neutral-100 bg-neutral-900 text-white">
        <PageContainer>
          <div className="mb-12 text-center">
            <h2 className="text-h1 text-white md:text-display">
              Voices from the shelf
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-neutral-400">
              Real feedback from buyers and sellers who use BooksBin week after
              week.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={t.name}
                className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm"
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary-400/40" />
                <div className="mb-4 flex gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        'h-4 w-4',
                        s <= t.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-white/20'
                      )}
                    />
                  ))}
                </div>
                <p className="flex-1 text-body-sm leading-relaxed text-neutral-200">
                  “{t.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-small font-bold text-white shadow-soft',
                      i % 4 === 0 && 'bg-gradient-to-br from-primary-500 to-primary-700',
                      i % 4 === 1 && 'bg-gradient-to-br from-secondary-500 to-secondary-700',
                      i % 4 === 2 && 'bg-gradient-to-br from-violet-500 to-fuchsia-600',
                      i % 4 === 3 && 'bg-gradient-to-br from-sky-500 to-cyan-600'
                    )}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <cite className="not-italic text-body-sm font-semibold text-white">
                      {t.name}
                    </cite>
                    <p className="text-small text-neutral-500">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* —— Final CTA —— */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 py-16 text-white md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
        >
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-secondary-400 blur-3xl" />
        </div>
        <PageContainer className="relative text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next chapter starts with one click
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100/95">
            Open the catalog or list your first book tonight—either way, you are
            joining a community that moves stories, not just boxes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button as={Link} to="/books" size="lg" variant="inverse">
              Start buying
            </Button>
            <Button as={Link} to="/register" size="lg" variant="outlineInverse">
              Open a seller account
            </Button>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}

export default Home
