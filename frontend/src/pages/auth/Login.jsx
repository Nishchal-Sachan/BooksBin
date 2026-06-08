import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import AuthLayout from '../../components/auth/AuthLayout'
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
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (user.role === 'admin') navigate('/admin/dashboard', { replace: true })
    else if (user.role === 'seller') navigate('/seller/dashboard', { replace: true })
    else navigate(location.state?.from?.pathname || '/', { replace: true })
  }, [isAuthenticated, user, navigate, location.state])

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(login(data))
      if (login.fulfilled.match(resultAction)) {
        toast.success('Welcome back!')
        const u = resultAction.payload.user
        const from = location.state?.from?.pathname
        if (u.role === 'admin') navigate('/admin/dashboard')
        else if (u.role === 'seller') navigate('/seller/dashboard')
        else navigate(from && from !== '/login' ? from : '/')
      } else {
        toast.error(resultAction.payload || 'Login failed')
      }
    } catch {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue shopping, track orders, and manage your library."
      footer={
        <p className="text-center text-body-sm text-ink-muted">
          New to BooksBin?{' '}
          <Link to="/register" className="link-primary font-semibold">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-small font-semibold text-ink-muted">
              Password
            </label>
            <Link to="/forgot-password" className="text-small font-medium text-primary-700 hover:text-primary-900">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
            autoComplete="current-password"
            placeholder="••••••••"
            label={null}
          />
        </div>
        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Login
