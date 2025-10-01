import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, totalItems, totalPrice, isLoading } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 0) return
    try {
      await dispatch(updateCartItem({ bookId, quantity: newQuantity })).unwrap()
      toast.success('Cart updated')
    } catch (error) {
      toast.error(error || 'Failed to update cart')
    }
  }

  const handleRemoveItem = async (bookId) => {
    try {
      await dispatch(removeFromCart(bookId)).unwrap()
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error(error || 'Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap()
        toast.success('Cart cleared')
      } catch (error) {
        toast.error(error || 'Failed to clear cart')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-6 text-2xl font-semibold text-gray-600">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <Link
                to="/books"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-500 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.book._id} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-20 w-16 object-cover rounded"
                      src={item.book.images?.[0] || '/placeholder-book.jpg'}
                      alt={item.book.title}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/books/${item.book._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.book.title}
                    </Link>
                    <p className="text-sm text-gray-500">by {item.book.author}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.book.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.book._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.book._id, item.quantity + 1)}
                      disabled={item.quantity >= item.book.stock || item.quantity >= 10}
                      className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.book.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.book._id)}
                      className="text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-6 py-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total ({totalItems} items)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="mt-4">
              <Link
                to="/checkout"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Proceed to Checkout
              </Link>
            </div>
            <div className="mt-2">
              <Link
                to="/books"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
