import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
  clearSessionTokens,
} from '../../utils/sessionTokens'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

const NO_REFRESH_PATHS = [
  '/auth/refresh',
  '/auth/login',
  '/auth/register',
  '/auth/logout',
]

function shouldSkipTokenRefresh(url, config) {
  if (!url) return false

  if (url.includes('/auth/me')) {
    return !config?.headers?.Authorization
  }

  return NO_REFRESH_PATHS.some((path) => url.includes(path))
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

async function refreshSession() {
  const refreshToken = getRefreshToken()

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh`,
        refreshToken ? { refreshToken } : {},
        { withCredentials: true }
      )
      .then(async (response) => {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }
        setSessionTokens(tokens)
        const { store } = await import('../store')
        const { setSessionTokens: syncRedux } = await import('../slices/authSlice')
        store.dispatch(syncRedux(tokens))
        return response
      })
      .catch(async (error) => {
        clearSessionTokens()
        const { store } = await import('../store')
        const { clearCredentials } = await import('../slices/authSlice')
        store.dispatch(clearCredentials())
        return Promise.reject(error)
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipTokenRefresh(originalRequest.url, originalRequest)
    ) {
      originalRequest._retry = true

      try {
        await refreshSession()
        const token = getAccessToken()
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
