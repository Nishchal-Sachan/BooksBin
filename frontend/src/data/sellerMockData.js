/**
 * Realistic seed data for the seller dashboard (inventory + orders).
 */

const img = (photoId, sig) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=480&q=80&sig=${sig}`

export const SEED_SELLER_BOOKS = [
  {
    _id: 'slr-1001',
    title: 'The Paper Palace — Signed Stock',
    author: 'Miranda Cowley Heller',
    price: 17.99,
    stock: 42,
    isbn: '9780593329842',
    category: 'Fiction',
    description:
      'Bestseller literary fiction. Store-exclusive remainder with slight shelf wear on select copies.',
    images: [img('photo-1544947950-fa07a98d237f', 91)],
  },
  {
    _id: 'slr-1002',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    price: 54.0,
    stock: 18,
    isbn: '9781449373320',
    category: 'Science & Technology',
    description: 'Technical reference — strong demand from bootcamp cohorts.',
    images: [img('photo-1515879218367-8466d910aaa4', 92)],
  },
  {
    _id: 'slr-1003',
    title: 'Salt, Fat, Acid, Heat',
    author: 'Samin Nosrat',
    price: 22.5,
    stock: 64,
    isbn: '9781476753836',
    category: 'Health & Wellness',
    description: 'Cookbook — gift season performer.',
    images: [img('photo-1504674900247-0877df9cc836', 93)],
  },
  {
    _id: 'slr-1004',
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    price: 15.25,
    stock: 31,
    isbn: '9780241425442',
    category: 'Mystery & Thriller',
    description: 'Cozy mystery series starter — book club orders.',
    images: [img('photo-1516979187457-637abb4f9353', 94)],
  },
  {
    _id: 'slr-1005',
    title: 'Financial Intelligence for Entrepreneurs',
    author: 'Karen Berman',
    price: 28.0,
    stock: 12,
    isbn: '9781422119157',
    category: 'Business & Economics',
    description: 'SMB workshop bundle partner title.',
    images: [img('photo-1554224155-6726b3ff858f', 95)],
  },
  {
    _id: 'slr-1006',
    title: 'Braiding Sweetgrass',
    author: 'Robin Wall Kimmerer',
    price: 19.95,
    stock: 55,
    isbn: '9781571313560',
    category: 'Non-Fiction',
    description: 'Indigenous wisdom / ecology — steady campus sales.',
    images: [img('photo-1481627834876-b7833e8f5570', 96)],
  },
  {
    _id: 'slr-1007',
    title: 'Lego Ideas — Architecture Studio',
    author: 'DK Publishing',
    price: 24.99,
    stock: 8,
    isbn: '9781465429657',
    category: 'Children',
    description: 'Low stock — reorder recommended.',
    images: [img('photo-1618666761369-be6fe0dbc6a8', 97)],
  },
  {
    _id: 'slr-1008',
    title: 'Station Eleven',
    author: 'Emily St. John Mandel',
    price: 16.5,
    stock: 0,
    isbn: '9780804172443',
    category: 'Fiction',
    description: 'Awaiting reprint — listing kept for backorders.',
    images: [img('photo-1524995997946-a7c2893cf19f', 98)],
  },
]

const daysAgo = (d) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  return t.toISOString()
}

export const SEED_SELLER_ORDERS = [
  {
    _id: 'sel-ord-2401',
    createdAt: daysAgo(1),
    status: 'processing',
    customer: {
      name: 'Jamie Chen',
      email: 'jamie.chen@email.com',
    },
    items: [
      {
        book: {
          _id: 'slr-1002',
          title: 'Designing Data-Intensive Applications',
          images: SEED_SELLER_BOOKS[1].images,
        },
        quantity: 1,
        price: 54.0,
      },
    ],
    totals: { total: 64.39 },
  },
  {
    _id: 'sel-ord-2402',
    createdAt: daysAgo(3),
    status: 'shipped',
    customer: { name: 'Morgan Ellis', email: 'morgan.ellis@email.com' },
    items: [
      {
        book: {
          _id: 'slr-1003',
          title: 'Salt, Fat, Acid, Heat',
          images: SEED_SELLER_BOOKS[2].images,
        },
        quantity: 2,
        price: 22.5,
      },
      {
        book: {
          _id: 'slr-1006',
          title: 'Braiding Sweetgrass',
          images: SEED_SELLER_BOOKS[5].images,
        },
        quantity: 1,
        price: 19.95,
      },
    ],
    totals: { total: 78.12 },
  },
  {
    _id: 'sel-ord-2403',
    createdAt: daysAgo(5),
    status: 'delivered',
    customer: { name: 'Priya Shah', email: 'priya.shah@email.com' },
    items: [
      {
        book: {
          _id: 'slr-1001',
          title: 'The Paper Palace — Signed Stock',
          images: SEED_SELLER_BOOKS[0].images,
        },
        quantity: 1,
        price: 17.99,
      },
    ],
    totals: { total: 25.78 },
  },
  {
    _id: 'sel-ord-2404',
    createdAt: daysAgo(8),
    status: 'delivered',
    customer: { name: 'Alex Rivera', email: 'alex.r@email.com' },
    items: [
      {
        book: {
          _id: 'slr-1004',
          title: 'The Thursday Murder Club',
          images: SEED_SELLER_BOOKS[3].images,
        },
        quantity: 3,
        price: 15.25,
      },
    ],
    totals: { total: 54.56 },
  },
  {
    _id: 'sel-ord-2405',
    createdAt: daysAgo(12),
    status: 'confirmed',
    customer: { name: 'Taylor Brooks', email: 't.brooks@email.com' },
    items: [
      {
        book: {
          _id: 'slr-1005',
          title: 'Financial Intelligence for Entrepreneurs',
          images: SEED_SELLER_BOOKS[4].images,
        },
        quantity: 1,
        price: 28.0,
      },
    ],
    totals: { total: 35.79 },
  },
  {
    _id: 'sel-ord-2406',
    createdAt: daysAgo(20),
    status: 'cancelled',
    customer: { name: 'Sam Okonkwo', email: 'sam.o@email.com' },
    items: [
      {
        book: {
          _id: 'slr-1008',
          title: 'Station Eleven',
          images: SEED_SELLER_BOOKS[7].images,
        },
        quantity: 1,
        price: 16.5,
      },
    ],
    totals: { total: 0 },
  },
  {
    _id: 'sel-ord-2407',
    createdAt: daysAgo(26),
    status: 'delivered',
    customer: { name: 'Riley Park', email: 'r.park@email.com' },
    items: [
      {
        book: {
          _id: 'slr-1002',
          title: 'Designing Data-Intensive Applications',
          images: SEED_SELLER_BOOKS[1].images,
        },
        quantity: 2,
        price: 54.0,
      },
    ],
    totals: { total: 124.78 },
  },
]

/** Last 6 months — mock gross revenue (USD) for chart */
export const MOCK_REVENUE_BY_MONTH = (() => {
  const labels = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
      revenue: [8200, 9100, 7800, 10400, 11200, 12850][5 - i],
    })
  }
  return labels
})()
