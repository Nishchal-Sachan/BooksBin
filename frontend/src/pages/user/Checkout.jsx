import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, MapPin, User, ShoppingBag, Lock } from 'lucide-react'
import { getCart } from '../../store/slices/cartSlice'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here')

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  billingSameAsShipping: z.boolean().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().optional()
}).refine((data) => {
  if (!data.billingSameAsShipping) {
    return data.billingAddress && data.billingCity && data.billingState && data.billingZipCode && data.billingCountry
  }
  return true
}, {
  message: "Billing address is required when different from shipping",
  path: ["billingAddress"]
})

const CheckoutForm = ({ cart, totals, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billingSameAsShipping: true
    }
  })

  const billingSameAsShipping = watch('billingSameAsShipping')

  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      createPaymentIntent()
    }
  }, [cart])

  const createPaymentIntent = async () => {
    try {
      const response = await api.post('/payment/create-payment-intent', {
        amount: totals.total,
        currency: 'usd'
      })
      setClientSecret(response.data.clientSecret)
    } catch (error) {
      toast.error('Failed to initialize payment')
    }
  }

  const onSubmit = async (data) => {
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    try {
      // Create order first
      const orderData = {
        items: cart.items.map(item => ({
          book: item.book._id,
          quantity: item.quantity,
          price: item.book.price
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        billingAddress: billingSameAsShipping ? {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        } : {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.billingAddress,
          city: data.billingCity,
          state: data.billingState,
          zipCode: data.billingZipCode,
          country: data.billingCountry
        },
        paymentMethod: 'stripe'
      }

      const orderResponse = await api.post('/orders', orderData)
      const order = orderResponse.data.order

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            address: {
              line1: data.address,
              city: data.city,
              state: data.state,
              postal_code: data.zipCode,
              country: data.country
            }
          }
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        // Confirm payment on backend
        await api.post('/payment/confirm-payment', {
          paymentIntentId: order.payment.paymentIntentId,
          orderId: order._id
        })

        toast.success('Payment successful!')
        onSuccess(order)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Shipping Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Shipping Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...register('firstName')}
              className="mt-1 input"
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...register('lastName')}
              className="mt-1 input"
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 input"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            {...register('phone')}
            type="tel"
            className="mt-1 input"
            placeholder="Phone number"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            {...register('address')}
            className="mt-1 input"
            placeholder="Street address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              {...register('city')}
              className="mt-1 input"
              placeholder="City"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              {...register('state')}
              className="mt-1 input"
              placeholder="State"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              {...register('zipCode')}
              className="mt-1 input"
              placeholder="ZIP code"
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            {...register('country')}
            className="mt-1 input"
            placeholder="Country"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <input
            {...register('billingSameAsShipping')}
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Billing address same as shipping
          </label>
        </div>

        {!billingSameAsShipping && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Billing Address</label>
              <input
                {...register('billingAddress')}
                className="mt-1 input"
                placeholder="Billing address"
              />
              {errors.billingAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  {...register('billingCity')}
                  className="mt-1 input"
                  placeholder="City"
                />
                {errors.billingCity && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingCity.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  {...register('billingState')}
                  className="mt-1 input"
                  placeholder="State"
                />
                {errors.billingState && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingState.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  {...register('billingZipCode')}
                  className="mt-1 input"
                  placeholder="ZIP code"
                />
                {errors.billingZipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingZipCode.message}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                {...register('billingCountry')}
                className="mt-1 input"
                placeholder="Country"
              />
              {errors.billingCountry && (
                <p className="mt-1 text-sm text-red-600">{errors.billingCountry.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </h3>
        <div className="border border-gray-300 rounded-md p-4">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="mt-2 text-sm text-gray-500 flex items-center">
          <Lock className="h-4 w-4 mr-1" />
          Your payment information is secure and encrypted
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Complete Order - ${formatPrice(totals.total)}`
        )}
      </button>
    </form>
  )
}

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalItems, totalPrice, isLoading } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(getCart())
  }, [dispatch, navigate, user])

  const calculateTotals = () => {
    const subtotal = totalPrice
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
    const total = subtotal + tax + shipping

    return { subtotal, tax, shipping, total }
  }

  const handleSuccess = (order) => {
    navigate(`/order-success/${order._id}`)
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
            <p className="mt-2 text-gray-500">Add items to your cart to proceed to checkout.</p>
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

  const totals = calculateTotals()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Elements stripe={stripePromise}>
              <CheckoutForm cart={{ items }} totals={totals} onSuccess={handleSuccess} />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-6 h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.book._id} className="flex items-center space-x-4">
                  <img
                    className="h-16 w-12 object-cover rounded"
                    src={item.book.images?.[0] || '/placeholder-book.jpg'}
                    alt={item.book.title}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.book.title}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.book.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Tax</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
