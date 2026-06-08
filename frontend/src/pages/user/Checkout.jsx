import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import {
  MapPin,
  Banknote,
  ClipboardList,
  ChevronLeft,
  Check,
} from 'lucide-react'
import { getCart, clearCartState } from '../../store/slices/cartSlice'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import { cn } from '../../utils/cn'
import { coverUrl } from '../../utils/bookHelpers'
import PageContainer from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Review & place order', icon: ClipboardList },
]

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone number required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
})

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { items, subtotal, tax, shipping, totalPrice, isLoading } = useSelector(
    (s) => s.cart
  )
  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])

  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0]

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
  })

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])

  useEffect(() => {
    api.get('/users/profile')
      .then((res) => {
        const addrs = res.data.user?.addresses || []
        setSavedAddresses(addrs)
        const def = addrs.find((a) => a.isDefault) || addrs[0]
        if (def) {
          const parts = (def.name || '').split(' ')
          setValue('firstName', parts[0] || '')
          setValue('lastName', parts.slice(1).join(' ') || '')
          setValue('address', def.street || '')
          setValue('city', def.city || '')
          setValue('state', def.state || '')
          setValue('zipCode', def.zipCode || '')
          setValue('country', def.country || 'India')
        }
        if (res.data.user?.profile?.phone) {
          setValue('phone', res.data.user.profile.phone)
        }
      })
      .catch(() => {})
  }, [setValue])

  const onShippingNext = handleSubmit(() => setStep(2))

  const placeOrder = async () => {
    const data = getValues()
    setPlacing(true)
    try {
      const orderItems = items.map((i) => ({
        book: i.book._id,
        quantity: i.quantity,
      }))
      const shippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      }
      const { data: res } = await api.post('/orders', {
        items: orderItems,
        shippingAddress,
        paymentMethod: 'cod',
      })
      dispatch(clearCartState())
      toast.success('Order placed! Pay cash on delivery.')
      navigate(`/order-success/${res.order._id}`, { state: { order: res.order } })
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (!isLoading && (!items || items.length === 0)) {
    return (
      <div className="min-h-screen bg-surface-subtle py-16">
        <PageContainer className="text-center">
          <h1 className="text-h1">Your cart is empty</h1>
          <p className="mt-3 text-ink-muted">Add books before checkout.</p>
          <Button as={Link} to="/books" className="mt-8">
            Browse books
          </Button>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer className="max-w-5xl">
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-body-sm text-ink-muted hover:text-primary-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <h1 className="text-h1 md:text-display">Checkout</h1>
        <p className="mt-2 text-body-sm text-ink-muted">
          Cash on delivery only — pay when your order arrives.
        </p>

        <div className="mt-8 flex gap-4">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-body-sm font-medium',
                step >= s.id
                  ? 'bg-primary-50 text-primary-800'
                  : 'bg-neutral-100 text-ink-muted'
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {step === 1 && (
              <Card className="p-6 shadow-soft">
                <h2 className="text-h3">Shipping address</h2>
                {savedAddresses.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-small font-medium text-ink-muted">
                      Saved addresses
                    </p>
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => {
                          const parts = (addr.name || '').split(' ')
                          setValue('firstName', parts[0] || '')
                          setValue('lastName', parts.slice(1).join(' ') || '')
                          setValue('address', addr.street || '')
                          setValue('city', addr.city || '')
                          setValue('state', addr.state || '')
                          setValue('zipCode', addr.zipCode || '')
                          setValue('country', addr.country || '')
                        }}
                        className="w-full rounded-lg border border-neutral-200 p-3 text-left text-body-sm hover:border-primary-300"
                      >
                        <span className="font-medium">{addr.name}</span>
                        <br />
                        {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={onShippingNext} className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ['firstName', 'First name'],
                    ['lastName', 'Last name'],
                    ['email', 'Email', 'sm:col-span-2'],
                    ['phone', 'Phone', 'sm:col-span-2'],
                    ['address', 'Street address', 'sm:col-span-2'],
                    ['city', 'City'],
                    ['state', 'State'],
                    ['zipCode', 'ZIP code'],
                    ['country', 'Country'],
                  ].map(([name, label, span]) => (
                    <div key={name} className={span || ''}>
                      <label className="text-small font-medium text-neutral-700">
                        {label}
                      </label>
                      <input
                        {...register(name)}
                        className="input-field mt-1 w-full"
                      />
                      {errors[name] && (
                        <p className="mt-1 text-small text-error-600">
                          {errors[name].message}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <Button type="submit" className="w-full sm:w-auto">
                      Continue to review
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6 shadow-soft">
                <h2 className="text-h3">Review your order</h2>
                <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-8 w-8 text-primary-600" />
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Cash on delivery
                      </p>
                      <p className="text-body-sm text-ink-muted">
                        Pay {formatPrice(totalPrice)} when your package is delivered.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {items.map((item) => (
                    <div key={item.book._id} className="flex gap-3">
                      <img
                        src={coverUrl(item.book)}
                        alt=""
                        className="h-16 w-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.book.title}</p>
                        <p className="text-small text-ink-muted">
                          Qty {item.quantity} · {formatPrice(item.book.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Edit address
                  </Button>
                  <Button onClick={placeOrder} disabled={placing}>
                    {placing ? 'Placing order…' : 'Place order'}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-24 p-6 shadow-soft">
              <h3 className="font-semibold text-neutral-900">Order summary</h3>
              <dl className="mt-4 space-y-2 text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">GST (10%)</dt>
                  <dd>{formatPrice(tax)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Shipping</dt>
                  <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatPrice(totalPrice)}</dd>
                </div>
              </dl>
              {step === 2 && (
                <p className="mt-4 flex items-center gap-2 text-small text-success-700">
                  <Check className="h-4 w-4" />
                  COD — no online payment required
                </p>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
