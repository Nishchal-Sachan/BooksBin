import {
  SEED_SELLER_BOOKS,
  SEED_SELLER_ORDERS,
  MOCK_REVENUE_BY_MONTH,
} from '../data/sellerMockData'

const BOOKS_KEY = 'booksbin_seller_books_v1'
const ORDERS_KEY = 'booksbin_seller_orders_v1'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function seedSellerStoreIfNeeded() {
  if (typeof localStorage === 'undefined') return
  if (!localStorage.getItem(BOOKS_KEY)) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(SEED_SELLER_BOOKS))
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_SELLER_ORDERS))
  }
}

export function getSellerBooks() {
  seedSellerStoreIfNeeded()
  return safeParse(localStorage.getItem(BOOKS_KEY), SEED_SELLER_BOOKS)
}

function setSellerBooks(books) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
}

export function getSellerOrders() {
  seedSellerStoreIfNeeded()
  return safeParse(localStorage.getItem(ORDERS_KEY), SEED_SELLER_ORDERS)
}

function setSellerOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function addSellerBook(book) {
  const books = getSellerBooks()
  const _id = `slr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  const next = [
    ...books,
    {
      ...book,
      _id,
      images: book.images?.length ? book.images : ['/placeholder-book.jpg'],
    },
  ]
  setSellerBooks(next)
  return _id
}

export function updateSellerBook(id, patch) {
  const books = getSellerBooks()
  const next = books.map((b) =>
    b._id === id ? { ...b, ...patch, _id: b._id } : b
  )
  setSellerBooks(next)
}

export function deleteSellerBook(id) {
  setSellerBooks(getSellerBooks().filter((b) => b._id !== id))
}

export function updateSellerOrderStatus(orderId, status) {
  const orders = getSellerOrders()
  const next = orders.map((o) =>
    o._id === orderId ? { ...o, status } : o
  )
  setSellerOrders(next)
}

export function computeSellerStats() {
  const orders = getSellerOrders()
  const books = getSellerBooks()
  const nonCancelled = orders.filter((o) => o.status !== 'cancelled')
  const totalOrders = orders.length
  const totalSales = nonCancelled.reduce(
    (s, o) => s + (Number(o.totals?.total) || 0),
    0
  )
  const activeBooks = books.filter((b) => (b.stock ?? 0) > 0).length
  return {
    totalSales,
    totalOrders,
    activeBooks,
    totalBooks: books.length,
  }
}

export function getSellerRecentOrders(limit = 6) {
  return [...getSellerOrders()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}

export function getSellerTopBooks(limit = 4) {
  const orders = getSellerOrders().filter((o) => o.status !== 'cancelled')
  const counts = {}
  orders.forEach((o) => {
    o.items?.forEach((line) => {
      const id = line.book?._id
      if (!id) return
      counts[id] = (counts[id] || 0) + (line.quantity || 0)
    })
  })
  const books = getSellerBooks()
  return books
    .map((b) => ({
      ...b,
      salesCount: counts[b._id] || 0,
    }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit)
}

export function getRevenueChartData() {
  return MOCK_REVENUE_BY_MONTH
}
