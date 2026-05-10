import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { register } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['user', 'seller'], {
      required_error: 'Please select a role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  })

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(register(data))
      if (register.fulfilled.match(resultAction)) {
        toast.success('Registration successful!')

        const user = resultAction.payload.user

        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (user.role === 'seller') {
          navigate('/seller/dashboard')
        } else {
          navigate('/')
        }
      } else {
        toast.error(resultAction.payload || 'Registration failed')
      }
    } catch {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-primary-600" aria-hidden />
          </div>
          <h2 className="mt-6 text-h1">Create your account</h2>
          <p className="mt-2 text-body-sm text-neutral-600">
            Or{' '}
            <Link to="/login" className="link-primary font-medium">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <Card className="p-8 shadow-card">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full name"
              {...registerForm('name')}
              type="text"
              placeholder="Enter your full name"
              error={errors.name?.message}
            />

            <Input
              label="Email address"
              {...registerForm('email')}
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              autoComplete="email"
            />

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-small font-medium text-neutral-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...registerForm('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 transition-colors hover:text-neutral-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-small text-error" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-small font-medium text-neutral-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  {...registerForm('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 transition-colors hover:text-neutral-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-small text-error" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-small font-medium text-neutral-700"
              >
                Account type
              </label>
              <select
                {...registerForm('role')}
                id="role"
                className="select-field"
              >
                <option value="user">Customer — Buy books</option>
                <option value="seller">Seller — Sell books</option>
              </select>
              {errors.role && (
                <p className="mt-1.5 text-small text-error" role="alert">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/30"
              />
              <label
                htmlFor="terms"
                className="text-body-sm text-neutral-700"
              >
                I agree to the{' '}
                <Link to="/terms" className="link-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="link-primary">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Creating account…' : 'Create account'}
            </Button>

            {error && (
              <div className="text-center text-body-sm text-error" role="alert">
                {error}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Register
