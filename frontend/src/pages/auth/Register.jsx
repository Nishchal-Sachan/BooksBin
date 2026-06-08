import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { register } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/cn'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
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
  })

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(register({ ...data, role: 'user' }))
      if (register.fulfilled.match(resultAction)) {
        toast.success('Welcome to BooksBin!')
        const user = resultAction.payload.user
        if (user.role === 'admin') navigate('/admin/dashboard')
        else if (user.role === 'seller') navigate('/seller/dashboard')
        else navigate('/')
      } else {
        toast.error(resultAction.payload || 'Registration failed')
      }
    } catch {
      toast.error('An unexpected error occurred')
    }
  }

  const passwordToggle = (visible, toggle) => (
    <button
      type="button"
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 transition-colors hover:text-ink-muted"
      onClick={toggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  )

  return (
    <AuthLayout
      title="Join BooksBin"
      subtitle="Create a free account to shop books, posters, and stationery with cash on delivery."
      footer={
        <p className="text-center text-body-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="link-primary font-semibold">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full name"
          {...registerForm('name')}
          type="text"
          placeholder="Your name"
          error={errors.name?.message}
        />
        <Input
          label="Email"
          {...registerForm('email')}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          autoComplete="email"
        />

        <div>
          <label htmlFor="password" className="mb-2 block text-small font-semibold text-ink-muted">
            Password
          </label>
          <div className="relative">
            <input
              {...registerForm('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={cn('input-field pr-11', errors.password && 'input-field-error')}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            {passwordToggle(showPassword, () => setShowPassword(!showPassword))}
          </div>
          {errors.password && (
            <p className="mt-1.5 text-small text-error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-small font-semibold text-ink-muted">
            Confirm password
          </label>
          <div className="relative">
            <input
              {...registerForm('confirmPassword')}
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={cn('input-field pr-11', errors.confirmPassword && 'input-field-error')}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
            {passwordToggle(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-small text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>

        {error && (
          <p className="text-center text-body-sm text-error">{error}</p>
        )}
      </form>
    </AuthLayout>
  )
}

export default Register
