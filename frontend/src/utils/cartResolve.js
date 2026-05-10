import { MOCK_BOOKS_CATALOG } from '../data/booksCatalogMock'
import { getMockProductBook } from '../data/bookProductMock'

/**
 * Resolve book payload for cart lines (mock / catalog). Omits long detail fields.
 */
export function resolveBookForCart(bookId) {
  const full = getMockProductBook(bookId)
  if (full) {
    return {
      _id: full._id,
      title: full.title,
      author: full.author,
      price: full.price,
      originalPrice: full.originalPrice,
      images: full.images,
      category: full.category,
      stock: full.stock ?? 99,
    }
  }
  const base = MOCK_BOOKS_CATALOG.find((b) => b._id === bookId)
  if (base) {
    return {
      ...base,
      stock: base.stock ?? 99,
    }
  }
  return {
    _id: bookId,
    title: 'Unknown item',
    author: '—',
    price: 0,
    images: ['/placeholder-book.jpg'],
    stock: 99,
  }
}
