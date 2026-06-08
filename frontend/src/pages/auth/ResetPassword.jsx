import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, CheckCircle, BookOpen } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset token')
      return
    }

    setIsLoading(true)
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      })
      setIsSuccess(true)
      toast.success('Password reset successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-6 p-8 text-center shadow-card">
          <CheckCircle className="mx-auto h-12 w-12 text-success" aria-hidden />
          <h2 className="text-h1">Password reset successful</h2>
          <p className="text-body-sm text-ink-muted">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
          <Link to="/login" className="link-primary font-medium">
            Sign in to your account
          </Link>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-6 p-8 text-center shadow-card">
          <BookOpen className="mx-auto h-12 w-12 text-primary-600" aria-hidden />
          <h2 className="text-h1">Invalid reset link</h2>
          <p className="text-body-sm text-ink-muted">
            This password reset link is invalid or has expired. Please request
            a new one.
          </p>
          <Link to="/forgot-password" className="link-primary font-medium">
            Request new reset link
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 shadow-card">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary-600" aria-hidden />
          <h2 className="mt-6 text-h1">Reset your password</h2>
          <p className="mt-2 text-body-sm text-ink-muted">
            Enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-small font-medium text-neutral-700"
            >
              New password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                {...register('newPassword')}
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`input-field pl-10 pr-11 ${errors.newPassword ? 'input-field-error' : ''}`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-ink-muted"
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
            {errors.newPassword && (
              <p className="mt-1.5 text-small text-error" role="alert">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-small font-medium text-neutral-700"
            >
              Confirm new password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'input-field-error' : ''}`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-ink-muted"
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Resetting…
              </span>
            ) : (
              'Reset password'
            )}
          </Button>

          <div className="text-center">
            <Link to="/login" className="link-primary font-medium">
              Back to login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ResetPassword
