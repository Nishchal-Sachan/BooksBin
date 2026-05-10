import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import {
  CheckCircle,
  Package,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react'
import { formatPrice, formatDate } from '../../utils/format'
import { loadMockOrder } from '../../utils/mockOrderStorage'
import PageContainer from '../../components/layout/PageContainer'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const statusBadge = (status) => {
  const s = status?.toLowerCase() || ''
  if (s === 'delivered' || s === 'confirmed')
    return { variant: 'success', className: 'capitalize' }
  if (s === 'cancelled') return { variant: 'sale', className: 'capitalize' }
  if (s === 'shipped') return { variant: 'secondary', className: 'capitalize' }
  return { variant: 'primary', className: 'capitalize' }
}

function itemImageSrc(book) {
  const img = book?.images?.[0]
  if (!img) return '/placeholder-book.jpg'
  return typeof img === 'string' ? img : img?.url || '/placeholder-book.jpg'
}

export default function OrderSuccess() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (location.state?.order && location.state.order._id === orderId) {
      setOrder(location.state.order)
      setReady(true)
      return
    }
    const stored = loadMockOrder(orderId)
    if (stored) {
      setOrder(stored)
    }
    setReady(true)
  }, [orderId, location.state])

  if (!ready) {
    return (
      <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
        <PageContainer className="max-w-4xl">
          <div className="flex h-48 items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          </div>
        </PageContainer>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
        <PageContainer className="max-w-4xl">
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-surface py-20 text-center shadow-soft">
            <Package className="mx-auto h-16 w-16 text-neutral-300" />
            <h2 className="mt-6 text-h2 text-neutral-800">Order not found</h2>
            <p className="mx-auto mt-2 max-w-md text-body-sm text-neutral-500">
              Demo orders are only kept in this browser session. If you refreshed
              or opened this link elsewhere, the receipt may no longer be
              available.
            </p>
            <Button as={Link} to="/books" className="mt-8">
              Continue shopping
            </Button>
          </div>
        </PageContainer>
      </div>
    )
  }

  const sb = statusBadge(order.status)
  const t = order.totals || {}
  const hasDiscount = (t.discount ?? 0) > 0

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer className="max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-muted text-success">
            <CheckCircle className="h-11 w-11" strokeWidth={1.75} aria-hidden />
          </div>
          <h1 className="mt-6 text-h1 md:text-display">Thank you!</h1>
          <p className="mt-2 text-body text-neutral-600">
            Your order is confirmed. We&apos;ve emailed a receipt to{' '}
            <span className="font-medium text-neutral-800">
              {order.shippingAddress?.email}
            </span>{' '}
            (demo — no email sent).
          </p>
          <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-surface px-4 py-2 text-body-sm text-neutral-700 shadow-soft">
            <span className="text-neutral-500">Order ID</span>
            <span className="font-mono font-semibold text-primary-700">
              {order.orderNumber || order._id}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-neutral-200/90 shadow-card">
            <CardContent className="space-y-4 p-6 md:p-8">
              <h2 className="text-h3">Order details</h2>
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-600">Order number</span>
                <span className="max-w-[60%] text-right font-mono text-small font-semibold text-neutral-900">
                  {order.orderNumber || order._id}
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-600">Order date</span>
                <span className="font-medium text-neutral-900">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-neutral-600">Status</span>
                <Badge variant={sb.variant} className={sb.className}>
                  {(order.status || 'confirmed').charAt(0).toUpperCase() +
                    (order.status || 'confirmed').slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-600">Total paid</span>
                <span className="font-semibold text-primary-600">
                  {formatPrice(t.total ?? 0)}
                </span>
              </div>

              {order.paymentMethodLabel && (
                <div className="flex items-start gap-2 rounded-xl border border-neutral-100 bg-surface-subtle px-3 py-2.5 text-body-sm text-neutral-700">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                  <span>
                    <span className="font-medium text-neutral-900">
                      Payment:{' '}
                    </span>
                    {order.paymentMethodLabel}
                  </span>
                </div>
              )}

              <div className="border-t border-neutral-100 pt-4">
                <h3 className="text-h3 mb-3">Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={`${item.book._id}-${item.quantity}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        className="h-12 w-8 rounded object-cover shadow-soft"
                        src={itemImageSrc(item.book)}
                        alt=""
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-medium text-neutral-900">
                          {item.book.title}
                        </p>
                        <p className="text-small text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-body-sm font-medium tabular-nums text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200/90 shadow-card">
            <CardContent className="space-y-4 p-6 md:p-8">
              <h2 className="text-h3">Shipping</h2>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-400" />
                <div className="text-body-sm text-neutral-700">
                  <p className="font-medium text-neutral-900">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-body-sm text-neutral-600">
                <Mail className="h-5 w-5 shrink-0 text-neutral-400" />
                <span>{order.shippingAddress.email}</span>
              </div>
              {order.shippingAddress.phone && (
                <div className="flex items-center gap-3 text-body-sm text-neutral-600">
                  <Phone className="h-5 w-5 shrink-0 text-neutral-400" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/orders" size="lg">
            <Package className="mr-2 h-4 w-4" />
            View my orders
          </Button>
          <Button as={Link} to="/books" variant="outline" size="lg">
            <ArrowRight className="mr-2 h-4 w-4" />
            Continue shopping
          </Button>
        </div>

        <Card className="mt-10 border-neutral-200/90 shadow-card">
          <CardContent className="space-y-2 p-6 md:p-8">
            <h2 className="text-h3 mb-4">Order summary</h2>
            {t.subtotal != null && (
              <div className="flex justify-between text-body-sm text-neutral-600">
                <span>Subtotal (items)</span>
                <span className="tabular-nums">{formatPrice(t.subtotal)}</span>
              </div>
            )}
            {hasDiscount && (
              <div className="flex justify-between text-body-sm text-success">
                <span>{t.discountLabel || 'Discount'}</span>
                <span className="tabular-nums">
                  −{formatPrice(t.discount)}
                </span>
              </div>
            )}
            {(t.subtotalAfterDiscount != null ||
              (t.subtotal != null && (t.discount ?? 0) > 0)) && (
              <div className="flex justify-between text-body-sm text-neutral-600">
                <span>After discounts</span>
                <span className="tabular-nums">
                  {formatPrice(
                    t.subtotalAfterDiscount ??
                      (t.subtotal ?? 0) - (t.discount ?? 0)
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between text-body-sm text-neutral-600">
              <span>Tax</span>
              <span className="tabular-nums">{formatPrice(t.tax ?? 0)}</span>
            </div>
            <div className="flex justify-between text-body-sm text-neutral-600">
              <span>Shipping</span>
              <span className="tabular-nums">
                {(t.shipping ?? 0) === 0
                  ? 'Free'
                  : formatPrice(t.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 text-lg font-semibold text-neutral-900">
              <span>Total</span>
              <span className="tabular-nums text-primary-600">
                {formatPrice(t.total ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  )
}
