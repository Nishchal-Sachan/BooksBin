import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'

export default function Unauthorized() {
  return (
    <div className="section-y bg-surface-subtle">
      <PageContainer className="py-20 text-center">
        <h1 className="text-h1">Access denied</h1>
        <p className="mt-3 text-body text-ink-muted">
          You don&apos;t have permission to view this page.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button as={Link} to="/">
            Go home
          </Button>
          <Button as={Link} to="/login" variant="outline">
            Sign in
          </Button>
        </div>
      </PageContainer>
    </div>
  )
}
