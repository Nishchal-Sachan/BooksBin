import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, BookOpen } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
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
      toast.success('Password reset email sent!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-6 p-8 shadow-card">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary-600" aria-hidden />
            <h2 className="mt-6 text-h1">Check your email</h2>
            <p className="mt-2 text-body-sm text-neutral-600">
              We&apos;ve sent you a password reset link. Please check your email
              and follow the instructions.
            </p>
          </div>
          <div className="text-center">
            <Link to="/login" className="link-primary font-medium">
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 shadow-card">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary-600" aria-hidden />
          <h2 className="mt-6 text-h1">Forgot your password?</h2>
          <p className="mt-2 text-body-sm text-neutral-600">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={`input-field pl-10 ${errors.email ? 'input-field-error' : ''}`}
            />
            {errors.email && (
              <p className="mt-1.5 text-small text-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending…
              </span>
            ) : (
              'Send reset link'
            )}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="link-primary inline-flex items-center justify-center font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ForgotPassword
