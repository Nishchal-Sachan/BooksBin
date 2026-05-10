/**
 * Static mock orders for the account "My orders" view (merged with checkout history in localStorage).
 */

import { MOCK_BOOKS_CATALOG } from './booksCatalogMock'

function snap(bookId) {
  const b = MOCK_BOOKS_CATALOG.find((x) => x._id === bookId)
  if (!b) return null
  return {
    _id: b._id,
    title: b.title,
    author: b.author,
    price: b.price,
    images: b.images,
  }
}

const daysAgo = (d) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  return t.toISOString()
}

export const MOCK_USER_ORDERS = [
  {
    _id: 'BB-DEMO-7K2M9P',
    orderNumber: 'BB-DEMO-7K2M9P',
    createdAt: daysAgo(2),
    status: 'shipped',
    items: [
      { book: snap('cat-003'), quantity: 1, price: 16.25 },
      { book: snap('cat-011'), quantity: 1, price: 13.75 },
    ],
    totals: {
      subtotal: 30,
      discount: 0,
      subtotalAfterDiscount: 30,
      tax: 3,
      shipping: 0,
      total: 33,
    },
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Reader',
      city: 'Portland',
      state: 'OR',
    },
  },
  {
    _id: 'BB-DEMO-4N8Q1R',
    orderNumber: 'BB-DEMO-4N8Q1R',
    createdAt: daysAgo(18),
    status: 'delivered',
    items: [{ book: snap('cat-001'), quantity: 2, price: 14.99 }],
    totals: {
      subtotal: 29.98,
      discount: 0,
      subtotalAfterDiscount: 29.98,
      tax: 3,
      shipping: 5.99,
      total: 38.97,
    },
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Reader',
      city: 'Portland',
      state: 'OR',
    },
  },
  {
    _id: 'BB-DEMO-2H5J3L',
    orderNumber: 'BB-DEMO-2H5J3L',
    createdAt: daysAgo(45),
    status: 'delivered',
    items: [
      { book: snap('cat-002'), quantity: 1, price: 18.5 },
      { book: snap('cat-006'), quantity: 1, price: 17.25 },
    ],
    totals: {
      subtotal: 35.75,
      discount: 3.58,
      discountLabel: '10% off orders $45+',
      subtotalAfterDiscount: 32.17,
      tax: 3.22,
      shipping: 5.99,
      total: 41.38,
    },
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Reader',
      city: 'Portland',
      state: 'OR',
    },
  },
  {
    _id: 'BB-DEMO-9T1V6W',
    orderNumber: 'BB-DEMO-9T1V6W',
    createdAt: daysAgo(62),
    status: 'processing',
    items: [{ book: snap('cat-025'), quantity: 1, price: 11.99 }],
    totals: {
      subtotal: 11.99,
      discount: 0,
      subtotalAfterDiscount: 11.99,
      tax: 1.2,
      shipping: 5.99,
      total: 19.18,
    },
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Reader',
      city: 'Portland',
      state: 'OR',
    },
  },
  {
    _id: 'BB-DEMO-5X8Y2Z',
    orderNumber: 'BB-DEMO-5X8Y2Z',
    createdAt: daysAgo(90),
    status: 'cancelled',
    items: [{ book: snap('cat-018'), quantity: 1, price: 9.99 }],
    totals: {
      subtotal: 9.99,
      discount: 0,
      subtotalAfterDiscount: 9.99,
      tax: 1,
      shipping: 5.99,
      total: 16.98,
    },
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Reader',
      city: 'Portland',
      state: 'OR',
    },
  },
]
