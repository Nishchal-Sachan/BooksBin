import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

  // ✅ If already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('user')
      const user = storedUser ? JSON.parse(storedUser) : null
      if (user) {
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true })
        } else if (user.role === 'seller') {
          navigate('/seller/dashboard', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      }
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(login(data))
      if (login.fulfilled.match(resultAction)) {
        toast.success('Login successful!')

        const { user, token } = resultAction.payload

        // ✅ Save token & user for persistence
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        // Redirect logic
        const from = location.state?.from?.pathname || '/'
        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (user.role === 'seller') {
          navigate('/seller/dashboard')
        } else {
          navigate(from === '/login' ? '/' : from)
        }
      } else {
        toast.error(resultAction.payload || 'Login failed')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
