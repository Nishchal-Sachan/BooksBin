import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/api'

// Async thunks
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart')
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ bookId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/add', { bookId, quantity })
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put('/cart/update', { bookId, quantity })
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/remove/${bookId}`)
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/cart/clear')
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

export const getCartCount = createAsyncThunk(
  'cart/getCartCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/count')
      return response.data.count
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart count')
    }
  }
)

const initialState = {
  items: [],
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
      state.totalItems = 0
      state.totalPrice = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
        state.totalItems = action.payload.totalItems || 0
        state.totalPrice = action.payload.totalPrice || 0
        state.error = null
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
        state.totalItems = action.payload.totalItems || 0
        state.totalPrice = action.payload.totalPrice || 0
        state.error = null
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
        state.totalItems = action.payload.totalItems || 0
        state.totalPrice = action.payload.totalPrice || 0
        state.error = null
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
        state.totalItems = action.payload.totalItems || 0
        state.totalPrice = action.payload.totalPrice || 0
        state.error = null
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = []
        state.totalItems = 0
        state.totalPrice = 0
        state.error = null
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get cart count
      .addCase(getCartCount.fulfilled, (state, action) => {
        state.totalItems = action.payload
      })
  },
})

export const { clearError, clearCartState } = cartSlice.actions
export default cartSlice.reducer
