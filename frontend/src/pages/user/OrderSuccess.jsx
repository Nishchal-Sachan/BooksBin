import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight, MapPin, Banknote } from 'lucide-react'
import api from '../../store/api/api'
import { formatPrice, formatDate } from '../../utils/format'
import { coverUrl } from '../../utils/bookHelpers'
import PageContainer from '../../components/layout/PageContainer'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (order?._id === orderId) {
      setReady(true)
      return
    }
    api.get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => {})
      .finally(() => setReady(true))
  }, [orderId, order?._id])

  if (!ready) {
    return (
      <div className="min-h-screen bg-surface-subtle py-8">
        <PageContainer className="flex h-48 items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        </PageContainer>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface-subtle py-16">
        <PageContainer className="text-center">
          <h1 className="text-h1">Order not found</h1>
          <Button as={Link} to="/orders" className="mt-6">
            View orders
          </Button>
        </PageContainer>
      </div>
    )
  }

  const addr = order.shippingAddress || {}

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-12">
      <PageContainer className="max-w-3xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-muted text-success-foreground">
            <CheckCircle className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-h1 md:text-display">Order confirmed!</h1>
          <p className="mt-3 text-body text-ink-muted">
            Thank you for your order. Pay{' '}
            <strong>{formatPrice(order.totals?.total)}</strong> cash on delivery.
          </p>
          <Badge variant="success" className="mt-4 capitalize">
            {order.status}
          </Badge>
        </div>

        <Card className="mt-10 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between gap-4 border-b border-neutral-100 pb-6">
              <div>
                <p className="text-small text-ink-muted">Order number</p>
                <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-small text-ink-muted">Placed</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-small text-ink-muted">Payment</p>
                <p className="flex items-center gap-1 font-semibold">
                  <Banknote className="h-4 w-4" />
                  Cash on delivery
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {order.items?.map((item) => (
                <div key={item.book?._id} className="flex gap-4">
                  <img
                    src={coverUrl(item.book)}
                    alt=""
                    className="h-20 w-14 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.book?.title}</p>
                    <p className="text-small text-ink-muted">
                      Qty {item.quantity} · {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-neutral-50 p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div className="text-body-sm text-ink-muted">
                <p className="font-medium text-neutral-900">Deliver to</p>
                <p className="mt-1">
                  {addr.name}
                  <br />
                  {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to={`/orders/${order._id}`}>
                <Package className="mr-2 h-4 w-4" />
                Track order
              </Button>
              <Button as={Link} to="/books" variant="outline">
                Continue shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  )
}
