import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import {
  getSellerOrders,
  updateSellerOrderStatus,
} from '../../utils/sellerMockStore'
import { cn } from '../../utils/cn'

const STATUSES = [
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const statusBadge = (status) => {
  const s = status?.toLowerCase() || ''
  if (s === 'delivered')
    return { variant: 'success', className: 'capitalize' }
  if (s === 'shipped')
    return { variant: 'secondary', className: 'capitalize' }
  if (s === 'cancelled')
    return { variant: 'sale', className: 'capitalize' }
  if (s === 'processing' || s === 'confirmed')
    return { variant: 'primary', className: 'capitalize' }
  return { variant: 'outline', className: 'capitalize' }
}

export default function SellerOrders() {
  const location = useLocation()
  const [status, setStatus] = useState('')
  const [orders, setOrders] = useState(() => getSellerOrders())

  useEffect(() => {
    setOrders(getSellerOrders())
  }, [location.pathname])

  const filtered = useMemo(() => {
    if (!status) return orders
    return orders.filter((o) => o.status === status)
  }, [orders, status])

  const updateStatus = (orderId, newStatus) => {
    updateSellerOrderStatus(orderId, newStatus)
    setOrders(getSellerOrders())
    toast.success(`Order marked as ${newStatus}`)
  }

  return (
    <SellerLayout
      title="Orders"
      subtitle="Review customer orders and move them through fulfillment — updates are saved locally for this demo."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-neutral-500">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          {status ? ` · ${status}` : ''}
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

      {filtered.length === 0 ? (
        <Card className="border-dashed border-neutral-200 py-16 text-center shadow-soft">
          <p className="text-body-sm text-neutral-500">No orders in this view.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden border-neutral-200/90 p-0 shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-body-sm">
              <thead className="border-b border-neutral-100 bg-surface-subtle text-small font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 pl-6">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 pr-6">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-surface">
                {filtered.map((o) => {
                  const sb = statusBadge(o.status)
                  return (
                    <tr key={o._id} className="hover:bg-neutral-50/50">
                      <td className="whitespace-nowrap px-4 py-3 pl-6 font-mono text-small font-semibold text-neutral-900">
                        {o._id.replace('sel-ord-', '#')}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-800">
                          {o.customer?.name}
                        </p>
                        <p className="text-small text-neutral-500">
                          {o.customer?.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {o.items?.length ?? 0} line
                        {(o.items?.length ?? 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-neutral-900">
                        {formatPrice(o.totals?.total ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={sb.variant} className={sb.className}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 pr-6">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className={cn(
                            'select-field max-w-full py-2 text-small sm:max-w-[11rem]'
                          )}
                          aria-label={`Update status for order ${o._id}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </SellerLayout>
  )
}
