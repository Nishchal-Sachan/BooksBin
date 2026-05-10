const STORAGE_KEY = 'booksbin_cart_v1'

/**
 * @returns {{ bookId: string, quantity: number }[]}
 */
export function loadCartEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
      .filter(
        (e) =>
          e &&
          typeof e.bookId === 'string' &&
          typeof e.quantity === 'number' &&
          e.quantity > 0
      )
      .map((e) => ({
        bookId: e.bookId,
        quantity: Math.min(99, Math.max(1, Math.floor(e.quantity))),
      }))
  } catch {
    return []
  }
}

export function saveCartEntries(entries) {
  try {
    const clean = entries
      .filter((e) => e.quantity > 0)
      .map((e) => ({ bookId: e.bookId, quantity: e.quantity }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  } catch {
    /* ignore quota / private mode */
  }
}
