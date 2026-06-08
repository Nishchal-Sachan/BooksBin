import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/auth/AuthLayout'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/cn'

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
      toast.success('Password updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="You're all set"
        subtitle="Your password has been updated. Sign in with your new credentials."
        footer={
          <Button as={Link} to="/login" size="lg" className="w-full">
            Sign in
          </Button>
        }
      >
        <div className="flex justify-center rounded-2xl border border-neutral-200 bg-surface-subtle py-10">
          <CheckCircle className="h-14 w-14 text-success" />
        </div>
      </AuthLayout>
    )
  }

  if (!token) {
    return (
      <AuthLayout
        title="Link expired"
        subtitle="This reset link is invalid or has already been used. Request a new one to continue."
        footer={
          <Button as={Link} to="/forgot-password" size="lg" className="w-full">
            Request new link
          </Button>
        }
      />
    )
  }

  const pwdField = (id, label, show, toggle, reg, err) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-small font-semibold text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <input
          {...reg}
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          className={cn('input-field pr-11', err && 'input-field-error')}
          placeholder="••••••••"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-ink-muted"
          onClick={toggle}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {err && <p className="mt-1.5 text-small text-error">{err}</p>}
    </div>
  )

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Use at least 6 characters. Pick something you haven't used on BooksBin before."
      footer={
        <Link to="/login" className="link-primary text-center font-semibold">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {pwdField(
          'newPassword',
          'New password',
          showPassword,
          () => setShowPassword(!showPassword),
          register('newPassword'),
          errors.newPassword?.message
        )}
        {pwdField(
          'confirmPassword',
          'Confirm password',
          showConfirmPassword,
          () => setShowConfirmPassword(!showConfirmPassword),
          register('confirmPassword'),
          errors.confirmPassword?.message
        )}
        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
