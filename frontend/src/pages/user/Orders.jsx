import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Eye,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  Star,
} from 'lucide-react'
import api from '../../store/api/api'
import { formatPrice, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { coverUrl } from '../../utils/bookHelpers'
import { cn } from '../../utils/cn'

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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const { data } = await api.get('/orders/my-orders', { params })
      setOrders(data.orders || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      await api.patch(`/orders/${orderId}/cancel`, { reason: 'Customer request' })
      toast.success('Order cancelled')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not cancel order')
    }
  }

  const canCancel = (order) =>
    ['pending', 'confirmed', 'processing'].includes(order.status)

  return (
    <AccountLayout
      title="Orders"
      subtitle="Track deliveries and view order history."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-neutral-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field min-w-[160px]"
        >
          <option value="">All orders</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <Card className="py-16 text-center shadow-soft">
          <Package className="mx-auto h-12 w-12 text-neutral-300" />
          <h2 className="mt-4 text-h3">No orders yet</h2>
          <p className="mt-2 text-body-sm text-ink-muted">
            When you place an order, it will appear here.
          </p>
          <Button as={Link} to="/books" className="mt-6">
            Start shopping
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-small text-ink-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-medium capitalize',
                    getStatusColor(order.status)
                  )}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-4">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.book?._id} className="flex gap-3">
                      <img
                        src={coverUrl(item.book)}
                        alt=""
                        className="h-20 w-14 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">
                          {item.book?.title}
                        </p>
                        <p className="text-small text-ink-muted">
                          Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-neutral-900">
                    Total: {formatPrice(order.totals?.total)}
                    <span className="ml-2 text-small font-normal text-ink-muted">
                      · COD
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {canCancel(order) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {['shipped', 'delivered'].includes(order.status) && (
                      <Button
                        as={Link}
                        to={`/orders/${order._id}`}
                        size="sm"
                        variant="outline"
                      >
                        <Star className="mr-1.5 h-4 w-4" />
                        Review
                      </Button>
                    )}
                    <Button as={Link} to={`/orders/${order._id}`} size="sm">
                      <Eye className="mr-1.5 h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
