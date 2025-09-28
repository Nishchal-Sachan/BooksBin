export const BOOK_CATEGORIES = [
  'fiction',
  'non-fiction',
  'mystery',
  'romance',
  'thriller',
  'sci-fi',
  'fantasy',
  'biography',
  'history',
  'self-help',
  'business',
  'technology',
  'science',
  'art',
  'children',
  'textbook',
  'other'
]

export const BOOK_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
]

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'confirmed', label: 'Confirmed', color: 'blue' },
  { value: 'processing', label: 'Processing', color: 'purple' },
  { value: 'shipped', label: 'Shipped', color: 'indigo' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
  { value: 'returned', label: 'Returned', color: 'gray' }
]

export const USER_ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin'
}

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'title', label: 'Title: A to Z' },
  { value: '-title', label: 'Title: Z to A' },
  { value: 'ratings.average', label: 'Highest Rated' },
  { value: '-ratings.average', label: 'Lowest Rated' }
]

export const PAGINATION_LIMITS = [12, 24, 48, 96]

export const CURRENCY_SYMBOL = '$'

export const SHIPPING_COST = 5.99
export const FREE_SHIPPING_THRESHOLD = 50
export const TAX_RATE = 0.1 // 10%
