import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '../ui/Spinner'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <Spinner size="xl" />
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If roles are defined and user doesn't match → unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace /> 
    // (better UX than sending them to "/")
  }

  // Authenticated and allowed → render children
  return children
}

export default ProtectedRoute;
