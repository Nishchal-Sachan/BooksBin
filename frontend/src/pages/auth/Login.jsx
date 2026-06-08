import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { BookOpen } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12">
      <Card className="w-full max-w-md border-neutral-200 p-8 shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-800 text-white">
          <BookOpen className="h-6 w-6" aria-hidden />
        </div>
        <h2 className="mt-5 text-center text-h1">Sign in</h2>
        <p className="mt-2 text-center text-body-sm text-ink-muted">
          Buyers, sellers, and staff all sign in here. Your dashboard opens based on your account role.
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
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-body-sm text-ink-muted">
          New here?{' '}
          <Link to="/register" className="link-primary font-medium">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Login
