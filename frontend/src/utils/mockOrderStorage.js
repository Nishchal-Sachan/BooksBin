const keyFor = (orderId) => `booksbin_mock_order_${orderId}`

/**
 * Human-readable mock order id, e.g. BB-LX9K2M-A4B7C1
 */
export function generateMockOrderId() {
  const partA = Date.now().toString(36).toUpperCase().slice(-6)
  const partB = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `BB-${partA}-${partB}`
}

export function persistMockOrder(order) {
  try {
    sessionStorage.setItem(keyFor(order._id), JSON.stringify(order))
  } catch {
    /* ignore */
  }
}

export function loadMockOrder(orderId) {
  if (!orderId) return null
  try {
    const raw = sessionStorage.getItem(keyFor(orderId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
