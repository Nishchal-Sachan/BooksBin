import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/api'
import { calcCartTotals } from '../../utils/bookHelpers'

function applyCart(state, cart) {
  const items = (cart?.items || []).filter((i) => i.book && i.book.isActive !== false)
  const totals = calcCartTotals(items)
  state.items = items
  state.subtotal = totals.subtotal
  state.tax = totals.tax
  state.shipping = totals.shipping
  state.totalItems = totals.totalItems
  state.totalPrice = totals.total
}

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart')
      return data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ bookId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart/add', { bookId, quantity })
      return data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/cart/update', { bookId, quantity })
      return data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cart/remove/${bookId}`)
      return data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete('/cart/clear')
      return data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

export const getCartCount = createAsyncThunk(
  'cart/getCartCount',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart/count')
      return data.count
    } catch (error) {
      return rejectWithValue(0)
    }
  }
)

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  totalItems: 0,
  totalPrice: 0,
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
      state.items = []
      state.subtotal = 0
      state.tax = 0
      state.shipping = 0
      state.totalItems = 0
      state.totalPrice = 0
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.isLoading = true
      state.error = null
    }
    const rejected = (state, action) => {
      state.isLoading = false
      state.error = action.payload
    }

    builder
      .addCase(getCart.pending, pending)
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false
        applyCart(state, action.payload)
      })
      .addCase(getCart.rejected, rejected)
      .addCase(addToCart.pending, pending)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        applyCart(state, action.payload)
      })
      .addCase(addToCart.rejected, rejected)
      .addCase(updateCartItem.pending, pending)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        applyCart(state, action.payload)
      })
      .addCase(updateCartItem.rejected, rejected)
      .addCase(removeFromCart.pending, pending)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false
        applyCart(state, action.payload)
      })
      .addCase(removeFromCart.rejected, rejected)
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false
        applyCart(state, action.payload)
      })
      .addCase(getCartCount.fulfilled, (state, action) => {
        state.totalItems = action.payload
      })
  },
})

export const { clearError, clearCartState } = cartSlice.actions
export default cartSlice.reducer
