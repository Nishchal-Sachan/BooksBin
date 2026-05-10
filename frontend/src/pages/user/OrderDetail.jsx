import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
} from 'lucide-react'
import { formatPrice, formatDate } from '../../utils/format'
import { resolveAccountOrderById } from '../../utils/accountOrderResolve'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

function itemImage(book) {
  const img = book?.images?.[0]
  if (!img) return '/placeholder-book.jpg'
  return typeof img === 'string' ? img : img?.url || '/placeholder-book.jpg'
}

const statusStyles = {
  delivered: 'bg-success-muted text-success-foreground',
  shipped: 'bg-secondary-100 text-secondary-800',
  processing: 'bg-primary-100 text-primary-800',
  confirmed: 'bg-primary-100 text-primary-800',
  cancelled: 'bg-error-muted text-error-foreground',
}

export default function OrderDetail() {
  const { orderId } = useParams()
  const order = useMemo(() => resolveAccountOrderById(orderId), [orderId])

  if (!order) {
    return (
      <AccountLayout title="Order" subtitle="We could not find this order.">
        <Card className="border-dashed border-neutral-200 p-10 text-center shadow-soft">
          <Package className="mx-auto h-14 w-14 text-neutral-300" />
          <p className="mt-4 text-body-sm text-neutral-600">
            Check the order ID or open it from your orders list.
          </p>
          <Button as={Link} to="/orders" className="mt-6">
            Back to orders
          </Button>
        </Card>
      </AccountLayout>
    )
  }

  const t = order.totals || {}
  const statusClass =
    statusStyles[order.status] || 'bg-neutral-100 text-neutral-700'

  return (
    <AccountLayout
      title="Order details"
      subtitle={`Placed ${formatDate(order.createdAt)}`}
    >
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 text-body-sm font-medium text-neutral-600 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          All orders
        </Link>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-small font-medium text-neutral-500">
                Order ID
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-neutral-900">
                {order.orderNumber || order._id}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-small font-semibold capitalize ${statusClass}`}
            >
              {order.status}
            </span>
          </div>
          {order.paymentMethodLabel && (
            <div className="mt-4 flex items-center gap-2 text-body-sm text-neutral-600">
              <CreditCard className="h-4 w-4 text-primary-600" />
              {order.paymentMethodLabel}
            </div>
          )}
        </Card>

        <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
          <h2 className="text-h3 mb-4">Items</h2>
          <ul className="divide-y divide-neutral-100">
            {order.items.map((item, i) => (
              <li
                key={`${item.book._id}-${i}`}
                className="flex gap-4 py-4 first:pt-0"
              >
                <img
                  src={itemImage(item.book)}
                  alt=""
                  className="h-20 w-14 shrink-0 rounded-lg object-cover shadow-soft"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">
                    {item.book.title}
                  </p>
                  <p className="text-small text-neutral-500">
                    by {item.book.author}
                  </p>
                  <p className="mt-1 text-body-sm text-neutral-600">
                    Qty {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="shrink-0 font-semibold tabular-nums text-neutral-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        {order.shippingAddress && (
          <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
            <h2 className="text-h3 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              Shipping address
            </h2>
            <p className="text-body-sm text-neutral-700">
              {[order.shippingAddress.firstName, order.shippingAddress.lastName]
                .filter(Boolean)
                .join(' ')}
              {order.shippingAddress.address && (
                <>
                  <br />
                  {order.shippingAddress.address}
                </>
              )}
              {(order.shippingAddress.city || order.shippingAddress.state) && (
                <>
                  <br />
                  {[
                    order.shippingAddress.city,
                    order.shippingAddress.state,
                    order.shippingAddress.zipCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </>
              )}
              {order.shippingAddress.country && (
                <>
                  <br />
                  {order.shippingAddress.country}
                </>
              )}
            </p>
          </Card>
        )}

        <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
          <h2 className="text-h3 mb-4">Summary</h2>
          <dl className="space-y-2 text-body-sm">
            {t.subtotal != null && (
              <div className="flex justify-between text-neutral-600">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(t.subtotal)}</dd>
              </div>
            )}
            {(t.discount ?? 0) > 0 && (
              <div className="flex justify-between text-success">
                <dt>{t.discountLabel || 'Discount'}</dt>
                <dd className="tabular-nums">−{formatPrice(t.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <dt>Tax</dt>
              <dd className="tabular-nums">{formatPrice(t.tax ?? 0)}</dd>
            </div>
            <div className="flex justify-between text-neutral-600">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {(t.shipping ?? 0) === 0
                  ? 'Free'
                  : formatPrice(t.shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-lg font-semibold text-neutral-900">
              <dt>Total</dt>
              <dd className="tabular-nums text-primary-600">
                {formatPrice(t.total ?? 0)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </AccountLayout>
  )
}
