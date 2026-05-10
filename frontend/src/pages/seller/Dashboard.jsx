import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  BookOpen,
  ShoppingBag,
  ArrowUpRight,
  Package,
} from 'lucide-react'
import { formatPrice, formatDate } from '../../utils/format'
import SellerLayout from '../../components/seller/SellerLayout'
import RevenueChart from '../../components/seller/RevenueChart'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  computeSellerStats,
  getSellerRecentOrders,
  getSellerTopBooks,
  getRevenueChartData,
} from '../../utils/sellerMockStore'
import { cn } from '../../utils/cn'

function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-700',
    neutral: 'bg-neutral-100 text-neutral-600',
  }
  return (
    <Card className="border-neutral-200/90 shadow-card transition-shadow hover:shadow-card">
      <CardContent className="flex items-start gap-4 p-5 md:p-6">
        <div className={cn('rounded-xl p-3', tones[tone])}>
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-small font-medium text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-small text-neutral-400">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function bookCover(b) {
  const img = b.images?.[0]
  if (!img) return '/placeholder-book.jpg'
  return typeof img === 'string' ? img : img?.url || '/placeholder-book.jpg'
}

export default function SellerDashboard() {
  const stats = useMemo(() => computeSellerStats(), [])
  const recentOrders = useMemo(() => getSellerRecentOrders(5), [])
  const topBooks = useMemo(() => getSellerTopBooks(4), [])
  const chartData = useMemo(() => getRevenueChartData(), [])

  return (
    <SellerLayout
      title="Overview"
      subtitle="Track performance, revenue, and what is selling best in your demo storefront."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={DollarSign}
            label="Total sales"
            value={formatPrice(stats.totalSales)}
            hint="Excludes cancelled orders"
            tone="primary"
          />
          <StatCard
            icon={ShoppingBag}
            label="Orders"
            value={stats.totalOrders}
            hint="All order records"
            tone="secondary"
          />
          <StatCard
            icon={BookOpen}
            label="Active listings"
            value={`${stats.activeBooks} / ${stats.totalBooks}`}
            hint="In-stock SKUs vs catalog size"
            tone="neutral"
          />
        </div>

        <RevenueChart data={chartData} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="border-neutral-200/90 shadow-card">
            <CardContent className="p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-h3 text-neutral-900">Recent orders</h2>
                <Button as={Link} to="/seller/orders" variant="outline" size="sm">
                  View all
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-body-sm text-neutral-500">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-neutral-100">
                  <table className="min-w-full text-left text-body-sm">
                    <thead className="bg-surface-subtle text-small font-semibold uppercase tracking-wide text-neutral-500">
                      <tr>
                        <th className="px-4 py-3">Order</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {recentOrders.map((o) => (
                        <tr key={o._id} className="bg-surface">
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-small font-medium text-neutral-900">
                            {o._id.replace('sel-ord-', '#')}
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            {o.customer?.name}
                          </td>
                          <td className="px-4 py-3 text-neutral-500">
                            {o.items?.length ?? 0}
                          </td>
                          <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">
                            {formatPrice(o.totals?.total ?? 0)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                            {formatDate(o.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-neutral-200/90 shadow-card">
            <CardContent className="p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-h3 text-neutral-900">Top sellers</h2>
                <Button as={Link} to="/seller/books" variant="outline" size="sm">
                  Manage books
                </Button>
              </div>
              {topBooks.length === 0 ? (
                <p className="text-body-sm text-neutral-500">No sales data.</p>
              ) : (
                <ul className="space-y-4">
                  {topBooks.map((b, i) => (
                    <li
                      key={b._id}
                      className="flex gap-4 rounded-xl border border-neutral-100 bg-surface-subtle/50 p-3"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-small font-bold text-primary-600 shadow-soft">
                        {i + 1}
                      </span>
                      <img
                        src={bookCover(b)}
                        alt=""
                        className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-soft"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-neutral-900 line-clamp-2">
                          {b.title}
                        </p>
                        <p className="text-small text-neutral-500">{b.author}</p>
                        <p className="mt-1 text-small text-neutral-600">
                          <span className="font-semibold text-primary-600">
                            {b.salesCount}
                          </span>{' '}
                          units sold · Stock{' '}
                          <span className="tabular-nums">{b.stock}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-dashed border-primary-200/80 bg-primary-50/30 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Fulfillment checklist</p>
                <p className="mt-1 text-body-sm text-neutral-600">
                  Update order statuses on the Orders page. Inventory changes sync
                  from My books and affect active listing counts above.
                </p>
              </div>
            </div>
            <Button as={Link} to="/seller/orders">
              Open orders
            </Button>
          </div>
        </Card>
      </div>
    </SellerLayout>
  )
}
