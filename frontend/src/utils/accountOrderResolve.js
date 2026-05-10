import { MOCK_USER_ORDERS } from '../data/mockUserOrders'
import { getCombinedOrders } from './orderHistoryStorage'
import { loadMockOrder } from './mockOrderStorage'

export function resolveAccountOrderById(orderId) {
  if (!orderId) return null
  const merged = getCombinedOrders(MOCK_USER_ORDERS)
  return merged.find((o) => o._id === orderId) || loadMockOrder(orderId)
}
