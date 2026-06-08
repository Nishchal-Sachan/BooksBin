import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, Banknote, Star } from 'lucide-react'
import api from '../../store/api/api'
import { formatPrice, formatDate } from '../../utils/format'
import { coverUrl } from '../../utils/bookHelpers'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const statusStyles = {
  delivered: 'bg-success-muted text-success-foreground',
  shipped: 'bg-secondary-100 text-secondary-800',
  processing: 'bg-primary-100 text-primary-800',
  confirmed: 'bg-primary-100 text-primary-800',
  cancelled: 'bg-error-muted text-error-foreground',
}

const REVIEWABLE = ['shipped', 'delivered']

export default function OrderDetail() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewedBookIds, setReviewedBookIds] = useState(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        const [orderRes, reviewsRes] = await Promise.all([
          api.get(`/orders/${orderId}`),
          api.get('/reviews/my-reviews', { params: { limit: 100 } }).catch(() => ({ data: { reviews: [] } })),
        ])
        setOrder(orderRes.data.order)
        const ids = new Set(
          (reviewsRes.data.reviews || []).map((r) => r.book?._id || r.book)
        )
        setReviewedBookIds(ids)
      } catch {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [orderId])

  if (loading) {
    return (
      <AccountLayout title="Order" subtitle="Loading…">
        <p className="text-ink-muted">Loading order details…</p>
      </AccountLayout>
    )
  }

  if (!order) {
    return (
      <AccountLayout title="Order" subtitle="We could not find this order.">
        <Card className="border-dashed border-neutral-200 p-10 text-center shadow-soft">
          <Package className="mx-auto h-14 w-14 text-neutral-300" />
          <p className="mt-4 text-body-sm text-ink-muted">
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
  const statusClass = statusStyles[order.status] || 'bg-neutral-100 text-neutral-700'
  const addr = order.shippingAddress || {}
  const canReviewOrder = REVIEWABLE.includes(order.status)

  return (
    <AccountLayout
      title="Order details"
      subtitle={`${order.orderNumber} · Placed ${formatDate(order.createdAt)}`}
    >
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-body-sm text-ink-muted hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-small font-medium capitalize ${statusClass}`}>
          {order.status}
        </span>
        <span className="text-body-sm text-ink-muted">
          Payment: Cash on delivery ({order.payment?.status || 'pending'})
        </span>
      </div>

      {canReviewOrder && (
        <Card className="mb-6 border-primary-200 bg-primary-50/40 p-4 shadow-soft">
          <p className="text-body-sm text-ink">
            <Star className="mr-1.5 inline h-4 w-4 text-amber-500" />
            Your order has arrived — rate the products you received and help other
            shoppers choose.
          </p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 shadow-soft">
          <h2 className="text-h3">Items</h2>
          <ul className="mt-4 divide-y divide-neutral-100">
            {order.items?.map((item) => {
              const bookId = item.book?._id
              const alreadyReviewed = reviewedBookIds.has(bookId)
              return (
                <li key={bookId} className="flex flex-col gap-3 py-4 sm:flex-row sm:gap-4">
                  <div className="flex flex-1 gap-4">
                    <img
                      src={coverUrl(item.book)}
                      alt=""
                      className="h-24 w-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.book?.title}</p>
                      <p className="text-body-sm text-ink-muted">{item.book?.author}</p>
                      <p className="mt-2 text-body-sm">
                        Qty {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  {canReviewOrder && bookId && (
                    <div className="sm:pl-20">
                      {alreadyReviewed ? (
                        <span className="text-small font-medium text-success-foreground">
                          Review submitted
                        </span>
                      ) : (
                        <Button
                          as={Link}
                          to={`/books/${bookId}`}
                          size="sm"
                          variant="outline"
                        >
                          <Star className="mr-1.5 h-4 w-4" />
                          Write a review
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 shadow-soft">
            <h3 className="flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4" />
              Shipping
            </h3>
            <p className="mt-3 text-body-sm text-ink-muted">
              {addr.name}
              <br />
              {addr.street}
              <br />
              {addr.city}, {addr.state} {addr.zipCode}
              <br />
              {addr.country}
              {addr.phone && (
                <>
                  <br />
                  {addr.phone}
                </>
              )}
            </p>
          </Card>

          <Card className="p-6 shadow-soft">
            <h3 className="flex items-center gap-2 font-semibold">
              <Banknote className="h-4 w-4" />
              Summary
            </h3>
            <dl className="mt-3 space-y-2 text-body-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd>{formatPrice(t.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">GST</dt>
                <dd>{formatPrice(t.tax)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd>{t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2 font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(t.total)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </AccountLayout>
  )
}
