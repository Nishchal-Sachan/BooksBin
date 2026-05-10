import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import {
  MapPin,
  ShoppingBag,
  CreditCard,
  Wallet,
  Smartphone,
  ClipboardList,
  ChevronLeft,
  Check,
} from 'lucide-react'
import { getCart, clearCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import { cn } from '../../utils/cn'
import PageContainer from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  generateMockOrderId,
  persistMockOrder,
} from '../../utils/mockOrderStorage'
import { appendOrderToHistory } from '../../utils/orderHistoryStorage'

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
]

const PAYMENT_OPTIONS = [
  {
    value: 'card',
    title: 'Credit or debit card',
    description: 'Demo only — no card data is collected or charged.',
    icon: CreditCard,
  },
  {
    value: 'paypal',
    title: 'PayPal',
    description: 'Simulated PayPal checkout for this preview.',
    icon: Wallet,
  },
  {
    value: 'apple_pay',
    title: 'Apple Pay',
    description: 'Simulated wallet payment.',
    icon: Smartphone,
  },
]

const checkoutFormSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .min(10, 'Please enter a valid phone number (at least 10 digits)'),
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
    billingCountry: z.string().optional(),
    paymentMethod: z.enum(['card', 'paypal', 'apple_pay'], {
      required_error: 'Please select a payment method',
    }),
  })
  .refine(
    (data) => {
      if (data.billingSameAsShipping === false) {
        return !!(
          data.billingAddress &&
          data.billingCity &&
          data.billingState &&
          data.billingZipCode &&
          data.billingCountry
        )
      }
      return true
    },
    {
      message: 'Billing address is required when different from shipping',
      path: ['billingAddress'],
    }
  )

const STEP1_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'zipCode',
  'country',
  'billingSameAsShipping',
  'billingAddress',
  'billingCity',
  'billingState',
  'billingZipCode',
  'billingCountry',
]

function lineImageSrc(book) {
  const first = book?.images?.[0]
  if (!first) return '/placeholder-book.jpg'
  return typeof first === 'string' ? first : first?.url || '/placeholder-book.jpg'
}

function StepProgress({ currentStep }) {
  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const done = currentStep > step.id
          const active = currentStep === step.id
          return (
            <li key={step.id} className="flex flex-1 items-center gap-3">
              <div className="flex w-full items-center gap-3 sm:block sm:w-auto">
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-small font-bold transition-colors',
                    done &&
                      'border-primary-600 bg-primary-600 text-white',
                    active &&
                      !done &&
                      'border-primary-600 bg-primary-50 text-primary-800',
                    !active &&
                      !done &&
                      'border-neutral-200 bg-white text-neutral-400'
                  )}
                >
                  {done ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </div>
                <div className="min-w-0 sm:mt-2 sm:text-center">
                  <p
                    className={cn(
                      'text-small font-semibold',
                      active || done ? 'text-neutral-900' : 'text-neutral-400'
                    )}
                  >
                    Step {step.id}
                  </p>
                  <p
                    className={cn(
                      'text-body-sm',
                      active ? 'font-medium text-primary-700' : 'text-neutral-600'
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'hidden h-0.5 flex-1 sm:mx-2 sm:block sm:min-w-[2rem]',
                    currentStep > step.id ? 'bg-primary-500' : 'bg-neutral-200'
                  )}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)

  const {
    items,
    subtotal: cartSubtotal,
    totalPrice,
    discountAmount,
    discountLabel,
  } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    watch,
    trigger,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      billingSameAsShipping: true,
      paymentMethod: undefined,
    },
    mode: 'onTouched',
  })

  const billingSameAsShipping = watch('billingSameAsShipping')
  const paymentMethod = watch('paymentMethod')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(getCart())
  }, [dispatch, navigate, user])

  const calculateTotals = () => {
    const subtotalAfterDiscount = totalPrice
    const tax = Math.round(subtotalAfterDiscount * 0.1 * 100) / 100
    const shipping = subtotalAfterDiscount > 50 ? 0 : 5.99
    const total =
      Math.round((subtotalAfterDiscount + tax + shipping) * 100) / 100
    return { subtotalAfterDiscount, tax, shipping, total }
  }

  const totals = calculateTotals()

  const goNextFromShipping = async () => {
    const ok = await trigger(STEP1_FIELDS)
    if (!ok) {
      toast.error('Please fix the errors below')
      return
    }
    setStep(2)
  }

  const goNextFromPayment = async () => {
    const ok = await trigger(['paymentMethod'])
    if (!ok) {
      toast.error('Choose how you would like to pay')
      return
    }
    setStep(3)
  }

  const onPlaceOrder = async () => {
    const ok = await trigger()
    if (!ok) {
      toast.error('Please complete all required fields')
      setStep(1)
      return
    }

    if (!items?.length) {
      toast.error('Your cart is empty')
      return
    }

    setPlacing(true)
    try {
      await new Promise((r) => setTimeout(r, 450))

      const data = getValues()
      const orderId = generateMockOrderId()
      const paymentLabel =
        PAYMENT_OPTIONS.find((p) => p.value === data.paymentMethod)?.title ||
        'Demo payment'

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

      const billingAddress =
        data.billingSameAsShipping !== false
          ? shippingAddress
          : {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.billingAddress,
              city: data.billingCity,
              state: data.billingState,
              zipCode: data.billingZipCode,
              country: data.billingCountry,
            }

      const order = {
        _id: orderId,
        orderNumber: orderId,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        items: items.map((item) => ({
          book: item.book,
          quantity: item.quantity,
          price: item.book.price,
        })),
        shippingAddress,
        billingAddress,
        paymentMethod: data.paymentMethod,
        paymentMethodLabel: paymentLabel,
        totals: {
          subtotal: cartSubtotal,
          discount: discountAmount,
          discountLabel,
          subtotalAfterDiscount: totalPrice,
          tax: totals.tax,
          shipping: totals.shipping,
          total: totals.total,
        },
      }

      persistMockOrder(order)
      appendOrderToHistory(order)
      await dispatch(clearCart()).unwrap()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${orderId}`, { state: { order } })
    } catch (e) {
      toast.error(
        typeof e === 'string' ? e : e?.message || 'Could not complete order'
      )
    } finally {
      setPlacing(false)
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
        <PageContainer>
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-neutral-300" />
            <h2 className="mt-6 text-h2 text-neutral-700">Your cart is empty</h2>
            <p className="mt-2 text-body-sm text-neutral-500">
              Add items to your cart to proceed to checkout.
            </p>
            <Button as={Link} to="/books" className="mt-8">
              Continue shopping
            </Button>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer>
        <div className="mb-2">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-body-sm font-medium text-neutral-600 transition-colors hover:text-primary-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to cart
          </Link>
        </div>
        <h1 className="text-h1 md:text-display mb-2">Checkout</h1>
        <p className="mb-8 text-body-sm text-neutral-500">
          Complete the steps below. Payments are simulated — no real charges.
        </p>

        <StepProgress currentStep={step} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {step === 1 && (
                <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
                  <h2 className="text-h3 mb-6 flex items-center gap-2 text-neutral-900">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    Shipping address
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-small font-medium text-neutral-700">
                        First name
                      </label>
                      <input
                        {...register('firstName')}
                        className="input-field"
                        autoComplete="given-name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-small text-error">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-small font-medium text-neutral-700">
                        Last name
                      </label>
                      <input
                        {...register('lastName')}
                        className="input-field"
                        autoComplete="family-name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-small text-error">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-small font-medium text-neutral-700">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-small text-error">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-small font-medium text-neutral-700">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input-field"
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-small text-error">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-small font-medium text-neutral-700">
                      Street address
                    </label>
                    <input
                      {...register('address')}
                      className="input-field"
                      autoComplete="street-address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-small text-error">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-small font-medium text-neutral-700">
                        City
                      </label>
                      <input
                        {...register('city')}
                        className="input-field"
                        autoComplete="address-level2"
                      />
                      {errors.city && (
                        <p className="mt-1 text-small text-error">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-small font-medium text-neutral-700">
                        State
                      </label>
                      <input
                        {...register('state')}
                        className="input-field"
                        autoComplete="address-level1"
                      />
                      {errors.state && (
                        <p className="mt-1 text-small text-error">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-small font-medium text-neutral-700">
                        ZIP code
                      </label>
                      <input
                        {...register('zipCode')}
                        className="input-field"
                        autoComplete="postal-code"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-small text-error">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-small font-medium text-neutral-700">
                      Country
                    </label>
                    <input
                      {...register('country')}
                      className="input-field"
                      autoComplete="country-name"
                    />
                    {errors.country && (
                      <p className="mt-1 text-small text-error">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 rounded-xl border border-neutral-100 bg-surface-subtle/80 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        {...register('billingSameAsShipping')}
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/30"
                      />
                      <span className="text-body-sm text-neutral-700">
                        Billing address is the same as shipping
                      </span>
                    </label>
                  </div>

                  {billingSameAsShipping === false && (
                    <div className="mt-6 space-y-4 border-t border-neutral-100 pt-6">
                      <h3 className="text-body font-semibold text-neutral-900">
                        Billing address
                      </h3>
                      <div>
                        <label className="mb-1 block text-small font-medium text-neutral-700">
                          Street address
                        </label>
                        <input
                          {...register('billingAddress')}
                          className="input-field"
                        />
                        {errors.billingAddress && (
                          <p className="mt-1 text-small text-error">
                            {errors.billingAddress.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-small font-medium text-neutral-700">
                            City
                          </label>
                          <input
                            {...register('billingCity')}
                            className="input-field"
                          />
                          {errors.billingCity && (
                            <p className="mt-1 text-small text-error">
                              {errors.billingCity.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-1 block text-small font-medium text-neutral-700">
                            State
                          </label>
                          <input
                            {...register('billingState')}
                            className="input-field"
                          />
                          {errors.billingState && (
                            <p className="mt-1 text-small text-error">
                              {errors.billingState.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-1 block text-small font-medium text-neutral-700">
                            ZIP code
                          </label>
                          <input
                            {...register('billingZipCode')}
                            className="input-field"
                          />
                          {errors.billingZipCode && (
                            <p className="mt-1 text-small text-error">
                              {errors.billingZipCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-small font-medium text-neutral-700">
                          Country
                        </label>
                        <input
                          {...register('billingCountry')}
                          className="input-field"
                        />
                        {errors.billingCountry && (
                          <p className="mt-1 text-small text-error">
                            {errors.billingCountry.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    className="mt-8 w-full sm:w-auto"
                    size="lg"
                    onClick={goNextFromShipping}
                  >
                    Continue to payment
                  </Button>
                </Card>
              )}

              {step === 2 && (
                <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
                  <h2 className="text-h3 mb-2 flex items-center gap-2 text-neutral-900">
                    <CreditCard className="h-5 w-5 text-primary-600" />
                    Payment method
                  </h2>
                  <p className="mb-6 text-body-sm text-neutral-500">
                    Select an option. This is a mock checkout — nothing is
                    charged.
                  </p>

                  <fieldset>
                    <legend className="sr-only">Payment method</legend>
                    <div className="space-y-3">
                      {PAYMENT_OPTIONS.map((opt) => {
                        const Icon = opt.icon
                        const selected = paymentMethod === opt.value
                        return (
                          <label
                            key={opt.value}
                            className={cn(
                              'flex cursor-pointer gap-4 rounded-xl border-2 p-4 transition-colors',
                              selected
                                ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20'
                                : 'border-neutral-200 hover:border-neutral-300'
                            )}
                          >
                            <input
                              type="radio"
                              value={opt.value}
                              className="mt-1 h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500/30"
                              {...register('paymentMethod')}
                            />
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-soft">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold text-neutral-900">
                                {opt.title}
                              </span>
                              <span className="mt-0.5 block text-small text-neutral-500">
                                {opt.description}
                              </span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                  {errors.paymentMethod && (
                    <p className="mt-3 text-small text-error">
                      {errors.paymentMethod.message}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="button" className="sm:min-w-[200px]" onClick={goNextFromPayment}>
                      Review order
                    </Button>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
                  <h2 className="text-h3 mb-6 flex items-center gap-2 text-neutral-900">
                    <ClipboardList className="h-5 w-5 text-primary-600" />
                    Review your order
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-small font-semibold uppercase tracking-wide text-neutral-500">
                        Ship to
                      </h3>
                      <p className="mt-2 text-body-sm text-neutral-800">
                        {getValues('firstName')} {getValues('lastName')}
                        <br />
                        {getValues('address')}
                        <br />
                        {getValues('city')}, {getValues('state')}{' '}
                        {getValues('zipCode')}
                        <br />
                        {getValues('country')}
                      </p>
                      <p className="mt-2 text-body-sm text-neutral-600">
                        {getValues('email')} · {getValues('phone')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-small font-semibold uppercase tracking-wide text-neutral-500">
                        Payment
                      </h3>
                      <p className="mt-2 text-body-sm font-medium text-neutral-900">
                        {PAYMENT_OPTIONS.find(
                          (p) => p.value === getValues('paymentMethod')
                        )?.title || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 border-t border-neutral-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      disabled={placing}
                      className="w-full sm:w-auto sm:min-w-[240px]"
                      onClick={onPlaceOrder}
                    >
                      {placing ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Placing order…
                        </span>
                      ) : (
                        `Place order — ${formatPrice(totals.total)}`
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </form>
          </div>

          <div className="lg:col-span-5">
            <Card className="sticky top-24 border-neutral-200/90 p-6 shadow-card md:p-8">
              <h3 className="text-h3 mb-4">Order summary</h3>
              <div className="max-h-[min(24rem,50vh)] space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.book._id} className="flex gap-3">
                    <img
                      className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-soft"
                      src={lineImageSrc(item.book)}
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-body-sm font-medium text-neutral-900">
                        {item.book.title}
                      </p>
                      <p className="text-small text-neutral-500">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-body-sm font-semibold tabular-nums text-neutral-900">
                      {formatPrice(item.book.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-body-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="mt-1 flex justify-between text-body-sm text-success">
                    <span>{discountLabel || 'Discount'}</span>
                    <span className="tabular-nums">
                      −{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex justify-between text-body-sm text-neutral-600">
                  <span>After discounts</span>
                  <span className="tabular-nums">{formatPrice(totalPrice)}</span>
                </div>
                <div className="mt-1 flex justify-between text-body-sm text-neutral-600">
                  <span>Estimated tax</span>
                  <span className="tabular-nums">{formatPrice(totals.tax)}</span>
                </div>
                <div className="mt-1 flex justify-between text-body-sm text-neutral-600">
                  <span>Shipping</span>
                  <span className="tabular-nums">
                    {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-lg font-semibold text-neutral-900">
                  <span>Total</span>
                  <span className="tabular-nums text-primary-600">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
