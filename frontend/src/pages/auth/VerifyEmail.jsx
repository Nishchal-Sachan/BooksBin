import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../store/api/api'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }

    api
      .get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12">
        <Card className="w-full max-w-md space-y-4 p-8 text-center shadow-card">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h2 className="text-h1">Verifying your email</h2>
          <p className="text-body-sm text-ink-muted">Please wait a moment…</p>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12">
        <Card className="w-full max-w-md space-y-6 p-8 text-center shadow-card">
          <CheckCircle className="mx-auto h-12 w-12 text-success" />
          <h2 className="text-h1">Email verified</h2>
          <p className="text-body-sm text-ink-muted">
            Your BooksBin account is verified. You can sign in and start shopping.
          </p>
          <Button as={Link} to="/login" className="w-full">
            Sign in
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12">
      <Card className="w-full max-w-md space-y-6 p-8 text-center shadow-card">
        {status === 'invalid' ? (
          <BookOpen className="mx-auto h-12 w-12 text-primary-600" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-error" />
        )}
        <h2 className="text-h1">
          {status === 'invalid' ? 'Invalid verification link' : 'Verification failed'}
        </h2>
        <p className="text-body-sm text-ink-muted">
          {status === 'invalid'
            ? 'This link is missing a token. Check the email we sent you or register again.'
            : 'This link may have expired or already been used. Request a new verification email from your account.'}
        </p>
        <div className="flex flex-col gap-3">
          <Button as={Link} to="/login" variant="outline">
            Back to sign in
          </Button>
          <Button as={Link} to="/register">
            Create account
          </Button>
        </div>
      </Card>
    </div>
  )
}
