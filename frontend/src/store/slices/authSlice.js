import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/api'
import { setSessionTokens as persistTokens, clearSessionTokens } from '../../utils/sessionTokens'

function sessionFromResponse(data) {
  return {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return sessionFromResponse(response.data)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      return sessionFromResponse(response.data)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed')
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/password', passwordData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    /* clear session on server even if call fails */
  }
  return null
})

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function applySession(state, { user, accessToken, refreshToken }) {
  state.user = user
  state.accessToken = accessToken
  state.refreshToken = refreshToken
  state.isAuthenticated = true
  state.error = null
  persistTokens({ accessToken, refreshToken })
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      clearSessionTokens()
    },
    setSessionTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      persistTokens(action.payload)
      state.isAuthenticated = Boolean(state.accessToken && state.user)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        applySession(state, action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        applySession(state, action.payload)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false
        if (!state.accessToken) {
          state.isAuthenticated = false
          state.user = null
        }
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
        clearSessionTokens()
      })
  },
})

export const { clearError, clearCredentials, setSessionTokens } = authSlice.actions
export default authSlice.reducer
