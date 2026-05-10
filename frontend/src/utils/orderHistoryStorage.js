const KEY = 'booksbin_order_history'

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function appendOrderToHistory(order) {
  const list = getStoredOrders()
  const next = [order, ...list.filter((o) => o._id !== order._id)].slice(0, 40)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

/** Stored checkout orders first, then static demo orders (deduped by _id). */
export function getCombinedOrders(staticDemoOrders) {
  const stored = getStoredOrders()
  const ids = new Set(stored.map((o) => o._id))
  const merged = [...stored, ...staticDemoOrders.filter((o) => !ids.has(o._id))]
  return merged.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}
