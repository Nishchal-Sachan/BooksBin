import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await api.post('/auth/forgot-password', data)
      setIsSubmitted(true)
      toast.success('Reset link sent')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="If an account exists for that email, we've sent a password reset link. It expires in 10 minutes."
        footer={
          <Link to="/login" className="link-primary inline-flex items-center justify-center gap-1.5 font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-surface-subtle px-6 py-10 text-center">
          <CheckCircle className="h-12 w-12 text-success" />
          <p className="mt-4 text-body-sm text-ink-muted">
            Didn&apos;t receive it? Check spam or try again in a few minutes.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter the email on your BooksBin account and we'll send you a secure reset link."
      footer={
        <Link to="/login" className="link-primary inline-flex items-center justify-center gap-1.5 font-semibold">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          {...register('email')}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
        />
        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
