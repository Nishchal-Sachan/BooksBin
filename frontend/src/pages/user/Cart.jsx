import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Minus, Plus, Trash2, ShoppingBag, Tag, Sparkles } from 'lucide-react'
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants'
import { cn } from '../../utils/cn'
import PageContainer from '../../components/layout/PageContainer'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { coverUrl } from '../../utils/bookHelpers'

const Cart = () => {
  const dispatch = useDispatch()
  const {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    totalPrice,
  } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 0) return
    try {
      await dispatch(
        updateCartItem({ bookId, quantity: newQuantity })
      ).unwrap()
    } catch (error) {
      toast.error(error || 'Failed to update cart')
    }
  }

  const handleRemoveItem = async (bookId) => {
    try {
      await dispatch(removeFromCart(bookId)).unwrap()
      toast.success('Removed from cart')
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

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-subtle py-10 md:py-14">
        <PageContainer>
          <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center shadow-card md:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100 text-primary-800">
              <ShoppingBag className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <h2 className="mt-8 text-h2 text-neutral-900">Your cart is empty</h2>
            <p className="mt-3 text-body-sm leading-relaxed text-ink-muted">
              Browse the shop and add books — your selections sync across this
              device and stay saved until you clear them.
            </p>
            <Button as={Link} to="/books" className="mt-10" size="lg">
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-h1 md:text-display">Shopping cart</h1>
            <p className="mt-1 text-body-sm text-ink-muted">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearCart}
            className="self-start text-body-sm font-medium text-error transition-colors hover:text-error/80"
          >
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Card className="overflow-hidden border-neutral-200 shadow-card">
              <ul className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <li
                    key={item.book._id}
                    className="px-4 py-5 transition-colors hover:bg-neutral-50/50 sm:px-6"
                  >
                    <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                      <Link
                        to={`/books/${item.book._id}`}
                        className="shrink-0 overflow-hidden rounded-xl ring-1 ring-neutral-200/80"
                      >
                        <img
                          className="h-28 w-[4.75rem] object-cover sm:h-32 sm:w-[5.25rem]"
                          src={coverUrl(item.book)}
                          alt=""
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/books/${item.book._id}`}
                          className="text-body font-semibold text-neutral-900 transition-colors hover:text-primary-800 line-clamp-2"
                        >
                          {item.book.title}
                        </Link>
                        <p className="mt-1 text-small text-ink-muted">
                          by {item.book.author}
                        </p>
                        <p className="mt-2 text-body-sm font-medium tabular-nums text-neutral-800">
                          {formatPrice(item.book.price)}{' '}
                          <span className="font-normal text-neutral-400">
                            each
                          </span>
                        </p>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                        <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white shadow-soft">
                          <button
                            type="button"
                            onClick={() =>
                              item.quantity <= 1
                                ? handleRemoveItem(item.book._id)
                                : handleUpdateQuantity(
                                    item.book._id,
                                    item.quantity - 1
                                  )
                            }
                            className="rounded-l-xl px-3 py-2.5 text-ink-muted transition-colors hover:bg-neutral-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2.25rem] px-2 text-center text-body-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.book._id,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >= (item.book.stock ?? 10) ||
                              item.quantity >= 10
                            }
                            className="rounded-r-xl px-3 py-2.5 text-ink-muted transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-body font-semibold tabular-nums text-neutral-900">
                            {formatPrice(item.book.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.book._id)}
                            className="rounded-xl p-2.5 text-neutral-400 transition-colors hover:bg-error-muted hover:text-error"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="sticky top-24 border-neutral-200 shadow-card">
              <CardContent className="space-y-5 p-6 md:p-7">
                <h2 className="text-h3 text-neutral-900">Order summary</h2>

                {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="flex items-start gap-2 rounded-xl border border-primary-200/80 bg-primary-50/80 px-3 py-2.5 text-small text-primary-900">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for{' '}
                      <strong>free shipping</strong>.
                    </span>
                  </div>
                )}

                <dl className="space-y-3 text-body-sm">
                  <div className="flex justify-between gap-4 text-ink-muted">
                    <dt>Subtotal</dt>
                    <dd className="font-medium tabular-nums text-neutral-900">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 text-ink-muted">
                    <dt>GST (10%)</dt>
                    <dd className="font-medium tabular-nums">
                      {formatPrice(tax)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 text-ink-muted">
                    <dt className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Shipping
                    </dt>
                    <dd className="font-medium tabular-nums">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </dd>
                  </div>
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-neutral-900">
                      <dt>Total</dt>
                      <dd className="tabular-nums text-primary-600">
                        {formatPrice(totalPrice)}
                      </dd>
                    </div>
                    <p className="mt-1 text-small text-ink-muted">
                      Cash on delivery at checkout
                    </p>
                  </div>
                </dl>

                <Button as={Link} to="/checkout" className="w-full" size="lg">
                  Proceed to checkout
                </Button>
                <Button
                  as={Link}
                  to="/books"
                  variant="outline"
                  className="w-full"
                >
                  Continue shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default Cart
