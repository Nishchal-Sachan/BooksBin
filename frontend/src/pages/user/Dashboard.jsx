import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Heart, MapPin, ShoppingCart, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../../store/api/api'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatPrice, formatDate } from '../../utils/format'

export default function UserDashboard() {
  const { user } = useSelector((s) => s.auth)
  const { totalItems } = useSelector((s) => s.cart)
  const [recentOrders, setRecentOrders] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [addressCount, setAddressCount] = useState(0)

  useEffect(() => {
    api.get('/orders/my-orders', { params: { limit: 3 } })
      .then((res) => setRecentOrders(res.data.orders?.slice(0, 3) || []))
      .catch(() => {})
    api.get('/users/wishlist')
      .then((res) => setWishlistCount(res.data.wishlist?.length || 0))
      .catch(() => {})
    api.get('/users/profile')
      .then((res) => setAddressCount(res.data.user?.addresses?.length || 0))
      .catch(() => {})
  }, [])

  const links = [
    { to: '/cart', label: 'Cart', value: `${totalItems} items`, icon: ShoppingCart },
    { to: '/orders', label: 'Orders', value: `${recentOrders.length}+ recent`, icon: Package },
    { to: '/wishlist', label: 'Wishlist', value: `${wishlistCount} saved`, icon: Heart },
    { to: '/addresses', label: 'Addresses', value: `${addressCount} saved`, icon: MapPin },
  ]

  return (
    <AccountLayout
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'Reader'}`}
      subtitle="Your account overview — orders, wishlist, and saved addresses."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map(({ to, label, value, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="p-5 shadow-soft transition-shadow hover:shadow-card">
              <Icon className="h-8 w-8 text-primary-600" />
              <p className="mt-3 font-semibold text-neutral-900">{label}</p>
              <p className="text-body-sm text-ink-muted">{value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Recent orders</h2>
          <Button as={Link} to="/orders" variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-4 text-body-sm text-ink-muted">
            No orders yet.{' '}
            <Link to="/books" className="text-primary-600 hover:underline">
              Browse books
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {recentOrders.map((order) => (
              <li key={order._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-small text-ink-muted">
                    {formatDate(order.createdAt)} · {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.totals?.total)}</p>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-small text-primary-600 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AccountLayout>
  )
}
