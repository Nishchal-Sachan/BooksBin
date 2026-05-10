import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Card } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

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

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

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
    } catch {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-card">
        <h2 className="text-center text-h1">Login</h2>
        <p className="mt-2 text-center text-body-sm text-neutral-600">
          Welcome back to BooksBin
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
            autoComplete="current-password"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-body-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="link-primary font-medium">
            Register
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Login
