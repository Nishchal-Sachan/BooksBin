import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Eye,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react'
import { MOCK_USER_ORDERS } from '../../data/mockUserOrders'
import { getCombinedOrders } from '../../utils/orderHistoryStorage'
import { formatPrice, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/cn'

function itemImage(book) {
  const img = book?.images?.[0]
  if (!img) return '/placeholder-book.jpg'
  return typeof img === 'string' ? img : img?.url || '/placeholder-book.jpg'
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmed':
    case 'processing':
      return <Clock className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <XCircle className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
    case 'processing':
      return 'bg-primary-100 text-primary-800'
    case 'shipped':
      return 'bg-secondary-100 text-secondary-800'
    case 'delivered':
      return 'bg-success-muted text-success-foreground'
    case 'cancelled':
      return 'bg-error-muted text-error-foreground'
    default:
      return 'bg-neutral-100 text-neutral-700'
  }
}

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('')

  const allOrders = getCombinedOrders(MOCK_USER_ORDERS)

  const orders = useMemo(() => {
    if (!statusFilter) return allOrders
    return allOrders.filter((o) => o.status === statusFilter)
  }, [allOrders, statusFilter])

  const handleCancelDemo = () => {
    toast('Demo orders cannot be cancelled from this preview.', { icon: 'ℹ️' })
  }

  const canCancelDemo = (order) =>
    ['confirmed', 'processing'].includes(order.status)

  return (
    <AccountLayout
      title="Orders"
      subtitle="Track deliveries and open receipts. History includes demo orders and your recent checkouts on this device."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-neutral-500">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
          {statusFilter ? ` · filtered` : ''}
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field min-w-[11rem]"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed border-neutral-200 p-12 text-center shadow-soft">
          <Package className="mx-auto h-14 w-14 text-neutral-300" />
          <h2 className="mt-4 text-h2 text-neutral-800">No orders</h2>
          <p className="mt-2 text-body-sm text-neutral-500">
            {statusFilter
              ? 'Try clearing the filter.'
              : 'Place an order from the shop to see it here.'}
          </p>
          <Button as={Link} to="/books" className="mt-6">
            Browse books
          </Button>
        </Card>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id}>
              <Card className="overflow-hidden border-neutral-200/90 shadow-card transition-shadow hover:shadow-card">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                        <Package className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono text-body-sm font-semibold text-neutral-900">
                            {order.orderNumber || order._id}
                          </p>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-small font-medium capitalize',
                              getStatusColor(order.status)
                            )}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-body-sm text-neutral-500">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="mt-2 text-body-sm font-medium text-neutral-800">
                          {formatPrice(order.totals?.total ?? 0)} ·{' '}
                          {order.items.length} item
                          {order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:shrink-0">
                      <Button variant="outline" size="sm" as={Link} to={`/orders/${order._id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        Details
                      </Button>
                      {canCancelDemo(order) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-error/30 text-error hover:bg-error-muted"
                          onClick={handleCancelDemo}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-neutral-100 pt-5">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div
                        key={`${order._id}-${item.book._id}-${idx}`}
                        className="flex items-center gap-2 rounded-lg bg-surface-subtle px-2 py-1.5"
                      >
                        <img
                          className="h-9 w-7 rounded object-cover"
                          src={itemImage(item.book)}
                          alt=""
                        />
                        <span className="max-w-[10rem] truncate text-small text-neutral-600">
                          {item.book.title}{' '}
                          <span className="text-neutral-400">×{item.quantity}</span>
                        </span>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="self-center text-small text-neutral-400">
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  )
}
