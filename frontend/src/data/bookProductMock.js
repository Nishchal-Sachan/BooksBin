/**
 * Mock product detail data merged with MOCK_BOOKS_CATALOG entries.
 */

import { MOCK_BOOKS_CATALOG } from './booksCatalogMock'

const img = (photoId, w = 960) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=82`

function idHash(id) {
  return String(id)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

const GALLERY_POOL = [
  'photo-1481627834876-b7833e8f5570',
  'photo-1512820790803-83ca734da794',
  'photo-1524578271613-d550eacf6090',
  'photo-1495446815901-a7297e633e8d',
  'photo-1519682337058-a94d519337bc',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1524995997946-a7c2893cf19f',
  'photo-1543002588-bfa74002ed7e',
]

const PUBLISHERS = [
  'Riverhead Books',
  'Penguin Random House',
  'Simon & Schuster',
  'HarperCollins',
  'Macmillan',
  'Vintage',
  'Anchor Books',
]

const REVIEW_BANK = [
  {
    userName: 'Alexandra Chen',
    rating: 5,
    comment:
      'Gorgeous prose and pacing — I finished it in two sittings. Already recommending it to my book club.',
    dateLabel: '2 weeks ago',
  },
  {
    userName: 'Marcus Webb',
    rating: 5,
    comment:
      'Exactly the depth I hoped for. The author balances research with storytelling without slowing down.',
    dateLabel: '1 month ago',
  },
  {
    userName: 'Priya N.',
    rating: 4,
    comment:
      'Strong characters and a satisfying arc. A few chapters in the middle felt slightly long, but worth it.',
    dateLabel: '3 days ago',
  },
  {
    userName: 'Daniel Okafor',
    rating: 5,
    comment:
      'Arrived in perfect condition. The edition quality is excellent — crisp print and sturdy binding.',
    dateLabel: '5 days ago',
  },
  {
    userName: 'Emily Rousseau',
    rating: 4,
    comment:
      'Thought-provoking without being preachy. I appreciated the practical takeaways at the end of each section.',
    dateLabel: '1 week ago',
  },
  {
    userName: 'James Whitaker',
    rating: 5,
    comment:
      'Instant classic territory for me. Emotional, sharp, and re-readable — rare combination.',
    dateLabel: '2 months ago',
  },
  {
    userName: 'Sofia Martín',
    rating: 4,
    comment:
      'Beautiful cover and typesetting. Story hooked me from chapter one; ending landed perfectly.',
    dateLabel: '4 days ago',
  },
  {
    userName: 'Ryan K.',
    rating: 5,
    comment:
      'If you only read one book in this genre this year, make it this one. Genuinely memorable.',
    dateLabel: '3 weeks ago',
  },
  {
    userName: 'Nina Patel',
    rating: 4,
    comment:
      'Clear writing and well structured. I highlighted more passages than usual — always a good sign.',
    dateLabel: '6 days ago',
  },
  {
    userName: 'Oliver Grant',
    rating: 5,
    comment:
      'BooksBin shipped fast and the packaging was protective. The book itself exceeded hype.',
    dateLabel: 'Yesterday',
  },
]

const HIGHLIGHT_ROTATION = [
  'Editor’s Pick — staff favorite this quarter',
  'Eligible for free returns within 30 days',
  'Carbon-neutral shipping on this title',
  'Includes exclusive reading guide (digital)',
  'Often bought as a gift — gift wrap available',
  'Millions of copies sold worldwide',
]

/** Rich copy for flagship titles; others use synthetic body text. */
const DETAIL_OVERRIDES = {
  'cat-001': {
    description: `Reclusive Hollywood legend Evelyn Hugo chooses an unknown magazine reporter to tell her life story — a decision that will unravel decades of glamour, ambition, and carefully guarded secrets. Taylor Jenkins Reid delivers a propulsive, emotionally rich novel about identity, love, and the price of fame.

Told with cinematic clarity and unforgettable voice, this is both a sweeping historical portrait and an intimate character study. Perfect for readers who enjoy layered narratives and morally complex heroines.`,
    highlights: [
      'Instant New York Times bestseller with a devoted fan following',
      'Ideal for book clubs — discussion themes on fame, truth, and sacrifice',
      'Lush period detail from classic Hollywood to the present day',
      'Emotionally resonant finale that lingers long after the last page',
    ],
    pages: 400,
    publisher: 'Atria Books',
    format: 'Paperback',
  },
  'cat-002': {
    description: `Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.

Built on biology, psychology, and Clear’s popular newsletter, the book distills complex science into simple rules: make it obvious, attractive, easy, and satisfying. Whether you want to save money, reduce stress, or perform better, this is the playbook.`,
    highlights: [
      'Over 15 million copies sold — the definitive habits guide',
      'Four Laws of Behavior Change — easy to remember, powerful in practice',
      'Worksheets-friendly structure; read in short chapters',
      'Backed by research, free of gimmicks and toxic productivity culture',
    ],
    pages: 320,
    publisher: 'Avery',
    format: 'Hardcover',
  },
  'cat-003': {
    description: `Ryland Grace is the sole survivor on a desperate, last-chance mission — and if he fails, humanity and Earth itself will perish. Andy Weir returns with a survival story that blends hard science, humor, and heart in equal measure.

From the author of The Martian comes a standalone adventure that celebrates curiosity, friendship, and ingenuity under impossible odds. Expect precision engineering, clever problem-solving, and genuine emotional payoff.`,
    highlights: [
      'From the author of The Martian — same wit, bigger stakes',
      'Rigorous science made thrilling and accessible',
      'Unlikely alliance at the core of the story — deeply moving',
      'Perfect for readers who love optimistic, smart sci-fi',
    ],
    pages: 496,
    publisher: 'Ballantine Books',
    format: 'Paperback',
  },
  'cat-012': {
    description: `Set on the desert planet Arrakis, Dune is the story of Paul Atreides — heir to a noble family tasked with ruling the universe’s most dangerous world. Political intrigue, ecology, and destiny collide in Frank Herbert’s masterpiece of science fiction.

Widely considered one of the greatest novels of the genre, Dune shaped generations of writers and filmmakers. This is world-building at its most immersive: fierce, philosophical, and unforgettable.`,
    highlights: [
      'Landmark science fiction — Hugo and Nebula award winner',
      'Epic scope: ecology, religion, empire, and personal transformation',
      'Inspiration for the acclaimed film adaptations',
      'Rich appendices and terminology for dedicated fans',
    ],
    pages: 688,
    publisher: 'Ace',
    format: 'Paperback',
  },
  'cat-025': {
    description: `Harry Potter has never been the star of a Quidditch team, scoring points while riding a broom far above the ground. He knows no spells, has never helped to hatch a dragon, and has never worn a cloak of invisibility — until he enrolls at Hogwarts School of Witchcraft and Wizardry.

J.K. Rowling’s debut begins an saga that defined childhood reading for millions. Discover the magic for the first time or return to the story that started it all.`,
    highlights: [
      'The global phenomenon that launched a beloved series',
      'Illustrated editions and house editions also available',
      'Timeless themes: courage, friendship, and chosen family',
      'Ideal first chapter book for confident middle-grade readers',
    ],
    pages: 309,
    publisher: 'Scholastic',
    format: 'Paperback',
  },
  'cat-026': {
    description: `Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. With each act of forgery, Winston grows more desperate to understand the real past — and to find the courage to dissent.

George Orwell’s chilling vision of totalitarianism remains essential reading. Sharp, urgent, and uncomfortably relevant, 1984 is both a warning and a mirror.`,
    highlights: [
      'Cornerstone of modern political fiction',
      'Compact and devastating — readable in a weekend',
      'Introductory essays in many editions provide historical context',
      'Frequently taught; excellent for classroom and discussion groups',
    ],
    pages: 328,
    publisher: 'Signet Classics',
    format: 'Paperback',
  },
}

function primaryImageUrl(book) {
  const first = book.images?.[0]
  if (!first) return '/placeholder-book.jpg'
  return typeof first === 'string' ? first : first?.url || '/placeholder-book.jpg'
}

function buildGallery(book) {
  const primary = primaryImageUrl(book)
  const h = idHash(book._id)
  const a = img(GALLERY_POOL[h % GALLERY_POOL.length], 960)
  const b = img(GALLERY_POOL[(h + 3) % GALLERY_POOL.length], 960)
  const urls = [primary]
  if (a !== primary) urls.push(a)
  if (b !== primary && b !== a) urls.push(b)
  return urls
}

function buildReviews(bookId) {
  const h = idHash(bookId)
  return Array.from({ length: 5 }, (_, i) => {
    const r = REVIEW_BANK[(h + i * 2) % REVIEW_BANK.length]
    return {
      id: `${bookId}-rev-${i}`,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      dateLabel: r.dateLabel,
    }
  })
}

function syntheticDescription(book) {
  return `${book.title} by ${book.author} is a standout ${book.category.toLowerCase()} title that has earned strong praise from readers and critics alike. This edition features quality production values, clear typography, and a durable binding suitable for close reading or display.

Whether you are discovering this author for the first time or returning to a favorite, BooksBin inspects every copy before shipment. Pair it with our curated recommendations in the same category for a complete reading stack.`
}

function syntheticHighlights(book) {
  const h = idHash(book._id)
  return [
    `Top-rated in ${book.category} with thousands of verified reader reviews`,
    HIGHLIGHT_ROTATION[h % HIGHLIGHT_ROTATION.length],
    'Secure packaging and tracked delivery on all orders',
    'Member rewards apply — check your account for eligible offers',
  ]
}

function buildSyntheticDetail(book) {
  const h = idHash(book._id)
  return {
    description: syntheticDescription(book),
    highlights: syntheticHighlights(book),
    reviews: buildReviews(book._id),
    gallery: buildGallery(book),
    isbn: `978-0-${String((h % 800) + 100).padStart(3, '0')}-${String((h % 9000) + 1000)}-${h % 10}`,
    publisher: PUBLISHERS[h % PUBLISHERS.length],
    pages: 220 + (h % 420),
    language: 'English',
    stock: 6 + (h % 48),
    format: h % 2 === 0 ? 'Paperback' : 'Hardcover',
  }
}

/**
 * Full product row for the book detail page (mock). Returns null if id not in catalog.
 */
export function getMockProductBook(id) {
  const base = MOCK_BOOKS_CATALOG.find((b) => b._id === id)
  if (!base) return null

  const synthetic = buildSyntheticDetail(base)
  const override = DETAIL_OVERRIDES[id] || {}
  const mergedGallery =
    override.gallery && override.gallery.length > 0
      ? override.gallery
      : synthetic.gallery

  return {
    ...base,
    ...synthetic,
    ...override,
    gallery: mergedGallery,
    reviews: override.reviews || synthetic.reviews,
    highlights: override.highlights || synthetic.highlights,
  }
}

/**
 * 4–6 related titles: same category first, then any others to fill.
 */
export function getMockRelatedBooks(bookId, limit = 6) {
  const self = MOCK_BOOKS_CATALOG.find((b) => b._id === bookId)
  if (!self) return []

  const same = MOCK_BOOKS_CATALOG.filter(
    (b) => b._id !== bookId && b.category === self.category
  )
  const rest = MOCK_BOOKS_CATALOG.filter(
    (b) => b._id !== bookId && b.category !== self.category
  )
  const merged = [...same, ...rest]
  return merged.slice(0, limit)
}

export const MOCK_CATALOG_IDS = new Set(MOCK_BOOKS_CATALOG.map((b) => b._id))
