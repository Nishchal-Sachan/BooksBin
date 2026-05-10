import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { resolveBookForCart } from '../../utils/cartResolve'
import { loadCartEntries, saveCartEntries } from '../../utils/localCartStorage'

const DISCOUNT_MIN_SUBTOTAL = 45
const DISCOUNT_RATE = 0.1

function recalcFromEntries(entries) {
  const clean = entries
    .filter((e) => e.quantity > 0)
    .map((e) => ({
      bookId: e.bookId,
      quantity: Math.min(99, Math.max(1, Math.floor(e.quantity))),
    }))

  const items = clean.map(({ bookId, quantity }) => ({
    book: resolveBookForCart(bookId),
    quantity,
  }))

  const subtotal =
    Math.round(
      items.reduce((s, i) => s + i.book.price * i.quantity, 0) * 100
    ) / 100

  let discountAmount = 0
  let discountLabel = ''
  if (subtotal >= DISCOUNT_MIN_SUBTOTAL) {
    discountAmount = Math.round(subtotal * DISCOUNT_RATE * 100) / 100
    discountLabel = '10% off orders $45+'
  }

  const totalPrice =
    Math.round((subtotal - discountAmount) * 100) / 100
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return {
    entries: clean,
    items,
    subtotal,
    discountAmount,
    discountLabel,
    totalItems,
    totalPrice,
  }
}

function persist(entries) {
  saveCartEntries(entries)
}

const boot = recalcFromEntries(loadCartEntries())

/** Hydrate cart from localStorage (e.g. after navigation or another tab saved). */
export const getCart = createAsyncThunk('cart/getCart', async () => {
  return loadCartEntries()
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ bookId, quantity = 1 }) => {
    return { bookId, quantity: quantity ?? 1 }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ bookId, quantity }) => {
    return { bookId, quantity }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (bookId) => bookId
)

export const clearCart = createAsyncThunk('cart/clearCart', async () => null)

export const getCartCount = createAsyncThunk(
  'cart/getCartCount',
  async (_, { getState }) => {
    return getState().cart.totalItems
  }
)

const initialState = {
  entries: boot.entries,
  items: boot.items,
  subtotal: boot.subtotal,
  discountAmount: boot.discountAmount,
  discountLabel: boot.discountLabel,
  totalItems: boot.totalItems,
  totalPrice: boot.totalPrice,
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCartState: (state) => {
      const next = recalcFromEntries([])
      Object.assign(state, next)
      persist([])
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false
        const next = recalcFromEntries(action.payload)
        state.entries = next.entries
        state.items = next.items
        state.subtotal = next.subtotal
        state.discountAmount = next.discountAmount
        state.discountLabel = next.discountLabel
        state.totalItems = next.totalItems
        state.totalPrice = next.totalPrice
        state.error = null
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { bookId, quantity } = action.payload
        const book = resolveBookForCart(bookId)
        const maxPerLine = Math.min(10, book.stock ?? 10)
        let entries = state.entries.map((e) => ({ ...e }))
        const i = entries.findIndex((e) => e.bookId === bookId)
        if (i >= 0) {
          const nextQty = Math.min(
            maxPerLine,
            entries[i].quantity + quantity
          )
          entries[i] = { bookId, quantity: nextQty }
        } else {
          entries.push({
            bookId,
            quantity: Math.min(maxPerLine, Math.max(1, quantity)),
          })
        }
        const next = recalcFromEntries(entries)
        state.entries = next.entries
        state.items = next.items
        state.subtotal = next.subtotal
        state.discountAmount = next.discountAmount
        state.discountLabel = next.discountLabel
        state.totalItems = next.totalItems
        state.totalPrice = next.totalPrice
        persist(entries)
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        let { bookId, quantity } = action.payload
        let entries = state.entries.map((e) => ({ ...e }))
        if (quantity <= 0) {
          entries = entries.filter((e) => e.bookId !== bookId)
        } else {
          const book = resolveBookForCart(bookId)
          const maxPerLine = Math.min(10, book.stock ?? 10)
          quantity = Math.min(maxPerLine, quantity)
          const i = entries.findIndex((e) => e.bookId === bookId)
          if (i >= 0) entries[i] = { bookId, quantity }
        }
        const next = recalcFromEntries(entries)
        state.entries = next.entries
        state.items = next.items
        state.subtotal = next.subtotal
        state.discountAmount = next.discountAmount
        state.discountLabel = next.discountLabel
        state.totalItems = next.totalItems
        state.totalPrice = next.totalPrice
        persist(entries)
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const bookId = action.payload
        const entries = state.entries.filter((e) => e.bookId !== bookId)
        const next = recalcFromEntries(entries)
        state.entries = next.entries
        state.items = next.items
        state.subtotal = next.subtotal
        state.discountAmount = next.discountAmount
        state.discountLabel = next.discountLabel
        state.totalItems = next.totalItems
        state.totalPrice = next.totalPrice
        persist(entries)
      })
      .addCase(clearCart.fulfilled, (state) => {
        const next = recalcFromEntries([])
        state.entries = next.entries
        state.items = next.items
        state.subtotal = next.subtotal
        state.discountAmount = next.discountAmount
        state.discountLabel = next.discountLabel
        state.totalItems = next.totalItems
        state.totalPrice = next.totalPrice
        persist([])
      })
      .addCase(getCartCount.fulfilled, (state, action) => {
        state.totalItems = action.payload
      })
  },
})

export const { clearError, clearCartState } = cartSlice.actions
export default cartSlice.reducer
