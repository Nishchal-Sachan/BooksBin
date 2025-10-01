import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight, Mail, Phone, MapPin } from 'lucide-react'
import api from '../../store/api/api'
import { formatPrice, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      setOrder(response.data.order)
    } catch (error) {
      toast.error('Failed to fetch order details')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <Package className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-6 text-2xl font-semibold text-gray-600">Order not found</h2>
            <p className="mt-2 text-gray-500">The order you're looking for doesn't exist.</p>
            <div className="mt-6">
              <Link
                to="/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. We've received your order and will process it shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Number:</span>
                <span className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Date:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(order.totals.total)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.book._id} className="flex items-center space-x-3">
                    <img
                      className="h-12 w-8 object-cover rounded"
                      src={item.book.images?.[0] || '/placeholder-book.jpg'}
                      alt={item.book.title}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.book.title}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
              </div>
              
              {order.shippingAddress.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              )}
            </div>

            {order.tracking && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-900 mb-2">Tracking Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Carrier:</span>
                    <span className="text-sm font-medium text-gray-900">{order.tracking.carrier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tracking Number:</span>
                    <span className="text-sm font-medium text-gray-900">{order.tracking.trackingNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Package className="h-4 w-4 mr-2" />
            View My Orders
          </Link>
          <Link
            to="/books"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm text-gray-900">{formatPrice(order.totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax:</span>
              <span className="text-sm text-gray-900">{formatPrice(order.totals.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Shipping:</span>
              <span className="text-sm text-gray-900">
                {order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>{formatPrice(order.totals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
