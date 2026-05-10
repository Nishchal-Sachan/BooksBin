/** Rich mock content for the marketing homepage (no API dependency). */

export const TRUST_STATS = [
  { value: '10,000+', label: 'Books listed', detail: 'New & pre-loved' },
  { value: '5,000+', label: 'Active readers', detail: 'Across the country' },
  { value: '1,200+', label: 'Independent sellers', detail: 'Verified profiles' },
]

export const MOCK_FEATURED_BOOKS = [
  {
    id: 'mock-1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 18.99,
    rating: 4.8,
    reviewCount: 2140,
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 22.5,
    rating: 4.9,
    reviewCount: 8920,
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    price: 19.25,
    rating: 4.7,
    reviewCount: 3421,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-4',
    title: 'Educated',
    author: 'Tara Westover',
    price: 16.99,
    rating: 4.6,
    reviewCount: 1567,
    image:
      'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-5',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 21.0,
    rating: 4.5,
    reviewCount: 6234,
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-6',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 17.5,
    rating: 4.8,
    reviewCount: 2890,
    image:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-7',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    price: 20.99,
    rating: 4.4,
    reviewCount: 987,
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-8',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    price: 23.75,
    rating: 4.6,
    reviewCount: 4102,
    image:
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80',
  },
]

export const CATEGORY_CARDS = [
  {
    slug: 'fiction',
    label: 'Fiction',
    description: 'Novels & stories',
    accent: 'from-violet-500/15 to-fuchsia-500/10',
    ring: 'ring-violet-200/60',
  },
  {
    slug: 'non-fiction',
    label: 'Non-fiction',
    description: 'Ideas that stick',
    accent: 'from-sky-500/15 to-cyan-500/10',
    ring: 'ring-sky-200/60',
  },
  {
    slug: 'self-help',
    label: 'Self-help',
    description: 'Grow on your terms',
    accent: 'from-amber-500/15 to-orange-500/10',
    ring: 'ring-amber-200/60',
  },
  {
    slug: 'academic',
    label: 'Academic',
    description: 'Textbooks & refs',
    accent: 'from-emerald-500/15 to-teal-500/10',
    ring: 'ring-emerald-200/60',
  },
  {
    slug: 'biography',
    label: 'Biography',
    description: 'Lives well told',
    accent: 'from-rose-500/15 to-pink-500/10',
    ring: 'ring-rose-200/60',
  },
  {
    slug: 'science',
    label: 'Science',
    description: 'Wonder, decoded',
    accent: 'from-indigo-500/15 to-blue-500/10',
    ring: 'ring-indigo-200/60',
  },
]

export const WHY_FEATURES = [
  {
    title: 'Affordable prices',
    body: 'Buy below retail and pass savings on when you resell—transparent pricing, no hidden fees at checkout.',
  },
  {
    title: 'Verified sellers',
    body: 'Every seller is identity-checked. Reviews and order history help you buy with confidence.',
  },
  {
    title: 'Fast delivery',
    body: 'Partners and sellers ship quickly with tracking from day one, so you are not left guessing.',
  },
  {
    title: 'Easy returns',
    body: 'Simple policies and in-app support if something is not as described—we have your back.',
  },
]

export const TESTIMONIALS = [
  {
    quote:
      'I cleared half my shelf in a weekend. Photos took two minutes per book and I had offers the same day.',
    name: 'Priya M.',
    role: 'Reader & casual seller',
    location: 'Austin, TX',
    initials: 'PM',
    rating: 5,
  },
  {
    quote:
      'Found three out-of-print design books for less than one would cost new. Condition was exactly as listed.',
    name: 'Jordan Lee',
    role: 'Product designer',
    location: 'Toronto, ON',
    initials: 'JL',
    rating: 5,
  },
  {
    quote:
      'As a small shop, BooksBin gives us reach without building our own storefront. Orders are easy to fulfill.',
    name: 'Elena Vásquez',
    role: 'Bookstore owner',
    location: 'Santa Fe, NM',
    initials: 'EV',
    rating: 5,
  },
  {
    quote:
      'Returns were painless when a dust jacket arrived creased. Support replied in under an hour.',
    name: 'Sam Okonkwo',
    role: 'Grad student',
    location: 'Chicago, IL',
    initials: 'SO',
    rating: 4,
  },
]
