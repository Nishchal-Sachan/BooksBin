import { useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatPrice, formatDate } from '../../utils/format'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/cn'

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusBadge = (status) => {
  const s = status?.toLowerCase() || ''
  if (s === 'delivered') return { variant: 'success', className: 'capitalize' }
  if (s === 'shipped') return { variant: 'secondary', className: 'capitalize' }
  if (s === 'cancelled') return { variant: 'sale', className: 'capitalize' }
  if (s === 'processing' || s === 'confirmed')
    return { variant: 'primary', className: 'capitalize' }
  return { variant: 'outline', className: 'capitalize' }
}

export default function SellerOrders() {
  const [status, setStatus] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const params = status ? { status } : {}
      const { data } = await api.get('/orders/seller/my-orders', { params })
      setOrders(data.orders || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [status])

  const filtered = useMemo(() => orders, [orders])

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus })
      toast.success(`Order marked as ${newStatus}`)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <SellerLayout
      title="Orders"
      subtitle="Review customer orders and update fulfillment status."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-ink-muted">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select-field min-w-[11rem]"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center shadow-soft">
          <p className="text-ink-muted">No orders yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const badge = statusBadge(order.status)
            return (
              <Card key={order._id} className="p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-small text-ink-muted">
                      {order.customer?.name} · {formatDate(order.createdAt)}
                    </p>
                    <p className="mt-1 font-medium">
                      {formatPrice(order.totals?.total)} · COD
                    </p>
                  </div>
                  <Badge variant={badge.variant} className={badge.className}>
                    {order.status}
                  </Badge>
                </div>
                <ul className="mt-4 text-body-sm text-ink-muted">
                  {order.items?.map((item) => (
                    <li key={item.book?._id}>
                      {item.book?.title} × {item.quantity}
                    </li>
                  ))}
                </ul>
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {STATUSES.filter((s) => s !== order.status).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateStatus(order._id, s)}
                        className={cn(
                          'rounded-lg border border-neutral-200 px-3 py-1.5 text-small font-medium capitalize',
                          'hover:border-primary-300 hover:bg-primary-50'
                        )}
                      >
                        Mark {s}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </SellerLayout>
  )
}
