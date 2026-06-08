import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  TAX_RATE,
} from './constants'

export const PLACEHOLDER_COVER = '/placeholder-book.svg'

export function coverUrl(book) {
  const first = book?.images?.[0]
  if (!first) return PLACEHOLDER_COVER
  return typeof first === 'string' ? first : first?.url || PLACEHOLDER_COVER
}

export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science & Technology',
  'Biographies',
  'Children',
  'Comics & Graphic Novels',
  'Education & Reference',
  'History',
  'Self-Help',
  'Business & Economics',
  'Fantasy',
  'Mystery & Thriller',
  'Romance',
  'Health & Wellness',
  'Academic & Textbooks',
  'Posters',
  'Art & Prints',
  'Stationery & Journals',
  'Merchandise & Gifts',
  'Magazines',
  'Other',
]

export const ISBN_OPTIONAL_CATEGORIES = new Set([
  'Posters',
  'Art & Prints',
  'Stationery & Journals',
  'Merchandise & Gifts',
  'Magazines',
  'Other',
])

export function isIsbnOptional(category) {
  return ISBN_OPTIONAL_CATEGORIES.has(category)
}

export function calcCartTotals(items = []) {
  const subtotal = Math.round(
    items.reduce((s, i) => s + (i.book?.price || 0) * i.quantity, 0) * 100
  ) / 100
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : subtotal > 0
        ? SHIPPING_COST
        : 0
  const total = Math.round((subtotal + tax + shipping) * 100) / 100
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  return { subtotal, tax, shipping, total, totalItems }
}
