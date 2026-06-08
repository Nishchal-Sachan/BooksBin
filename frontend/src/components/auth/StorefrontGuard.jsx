import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { dashboardPathForRole, isStaff } from '../../utils/roles'

/** Keeps sellers/admins in their portal — storefront is for shoppers only */
export default function StorefrontGuard({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth)

  if (isAuthenticated && isStaff(user)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  return children
}
