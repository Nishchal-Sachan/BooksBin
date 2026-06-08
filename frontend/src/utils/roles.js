export function isBuyer(user) {
  return user?.role === 'user'
}

export function isSeller(user) {
  return user?.role === 'seller'
}

export function isAdmin(user) {
  return user?.role === 'admin'
}

export function isStaff(user) {
  return isSeller(user) || isAdmin(user)
}

export function dashboardPathForRole(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'seller') return '/seller/dashboard'
  return '/account'
}
