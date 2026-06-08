import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  BookOpen,
  ShoppingBag,
  ArrowUpRight,
  Package,
} from 'lucide-react'
import api from '../../store/api/api'
import { formatPrice, formatDate } from '../../utils/format'
import { coverUrl } from '../../utils/bookHelpers'
import SellerLayout from '../../components/seller/SellerLayout'
import RevenueChart from '../../components/seller/RevenueChart'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/cn'

function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-700',
    neutral: 'bg-neutral-100 text-ink-muted',
  }
  return (
    <Card className="border-neutral-200 shadow-card transition-shadow hover:shadow-card">
      <CardContent className="flex items-start gap-4 p-5 md:p-6">
        <div className={cn('rounded-xl p-3', tones[tone])}>
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-small font-medium text-ink-muted">{label}</p>
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

export default function SellerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sellers/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []
  const topBooks = data?.topBooks || []
  const chartData = (data?.monthlySales || []).map((m) => ({
    label: `${m._id.month}/${String(m._id.year).slice(-2)}`,
    revenue: m.totalSales || 0,
  }))

  if (loading) {
    return (
      <SellerLayout title="Dashboard" subtitle="Loading…">
        <p className="text-ink-muted">Loading dashboard…</p>
      </SellerLayout>
    )
  }

  return (
    <SellerLayout
      title="Seller dashboard"
      subtitle="Overview of your inventory, orders, and revenue."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Active books"
          value={stats.totalBooks ?? 0}
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={stats.totalOrders ?? 0}
          tone="secondary"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={formatPrice(stats.totalSales ?? 0)}
        />
        <StatCard
          icon={Package}
          label="Units sold"
          value={stats.totalItems ?? 0}
          tone="neutral"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-h3">Recent orders</h2>
            <Button as={Link} to="/seller/orders" variant="ghost" size="sm">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-body-sm text-ink-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-neutral-100">
              {recentOrders.map((order) => (
                <li key={order._id} className="flex justify-between py-3 text-body-sm">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-ink-muted">
                      {order.customer?.name} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="capitalize text-ink-muted">{order.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6 shadow-soft">
          <h2 className="text-h3">Top sellers</h2>
          {topBooks.length === 0 ? (
            <p className="mt-4 text-body-sm text-ink-muted">No sales data yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topBooks.map((book) => (
                <li key={book._id} className="flex items-center gap-3">
                  <img
                    src={coverUrl(book)}
                    alt=""
                    className="h-12 w-9 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{book.title}</p>
                    <p className="text-small text-ink-muted">
                      {book.salesCount ?? 0} sold
                    </p>
                  </div>
                  <p className="font-semibold text-primary-700">
                    {formatPrice(book.price)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="mt-8 p-6 shadow-soft">
          <h2 className="text-h3 mb-4">Monthly revenue</h2>
          <RevenueChart data={chartData} />
        </Card>
      )}
    </SellerLayout>
  )
}
