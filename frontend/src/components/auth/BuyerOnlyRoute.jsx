import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import { dashboardPathForRole, isBuyer } from '../../utils/roles'

export default function BuyerOnlyRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useSelector((s) => s.auth)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isBuyer(user)) {
    return <Navigate to={dashboardPathForRole(user?.role)} replace />
  }

  return children
}
