const KEY = 'booksbin_wishlist_ids'

/** Default demo wishlist when user has never customized */
const DEFAULT_IDS = ['cat-002', 'cat-007', 'cat-012', 'cat-017', 'cat-023']

export function getWishlistIds() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return [...DEFAULT_IDS]
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return [...DEFAULT_IDS]
  }
}

export function setWishlistIds(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

export function addWishlistId(bookId) {
  const ids = getWishlistIds()
  if (ids.includes(bookId)) return
  setWishlistIds([...ids, bookId])
}

export function removeWishlistId(bookId) {
  setWishlistIds(getWishlistIds().filter((id) => id !== bookId))
}
