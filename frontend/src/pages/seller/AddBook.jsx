import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProductImageUpload from '../../components/ui/ProductImageUpload'
import api from '../../store/api/api'
import { BOOK_CATEGORIES, isIsbnOptional } from '../../utils/bookHelpers'

const schema = z
  .object({
    title: z.string().min(2, 'Title is required'),
    author: z.string().min(2, 'Author, artist, or brand is required'),
    price: z.coerce.number().positive('Price must be positive'),
    isbn: z.string().optional(),
    stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
    category: z.string().min(2, 'Category is required'),
    description: z.string().min(10, 'Description is required'),
  })
  .superRefine((data, ctx) => {
    if (!isIsbnOptional(data.category) && (!data.isbn || data.isbn.trim().length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ISBN is required for book categories',
        path: ['isbn'],
      })
    }
  })

export default function AddBook() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [productImage, setProductImage] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: '', isbn: '' },
  })

  const category = watch('category')
  const isbnOptional = category ? isIsbnOptional(category) : false

  const onSubmit = async (data) => {
    if (!productImage?.url) {
      toast.error('Please upload a product image')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        title: data.title,
        author: data.author,
        price: data.price,
        stock: data.stock,
        category: data.category,
        description: data.description,
        images: [
          {
            url: productImage.url,
            publicId: productImage.publicId,
            isPrimary: true,
          },
        ],
      }
      if (data.isbn?.trim()) payload.isbn = data.isbn.trim()

      await api.post('/books', payload)
      toast.success('Product published to your catalog')
      reset()
      setProductImage(null)
      navigate('/seller/books')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SellerLayout
      title="Add product"
      subtitle="Upload a cover photo and list books, posters, stationery, or merch for sale."
    >
      <Card className="max-w-3xl border-neutral-200 p-6 shadow-card md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <ProductImageUpload value={productImage} onChange={setProductImage} />

          <div>
            <label className="mb-2 block text-small font-semibold text-ink-muted">Title</label>
            <input
              {...register('title')}
              className="input-field"
              placeholder="e.g. Dune, Movie poster, Notebook set"
            />
            {errors.title && (
              <p className="mt-1.5 text-small text-error">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-small font-semibold text-ink-muted">
              Author / artist / brand
            </label>
            <input
              {...register('author')}
              className="input-field"
              placeholder="Author name or brand"
            />
            {errors.author && (
              <p className="mt-1.5 text-small text-error">{errors.author.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-small font-semibold text-ink-muted">Category</label>
            <select {...register('category')} className="select-field">
              <option value="">— Select category —</option>
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-small text-error">{errors.category.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">
                Price (INR)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                {...register('price')}
                className="input-field"
                placeholder="299"
              />
              {errors.price && (
                <p className="mt-1.5 text-small text-error">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">
                ISBN {isbnOptional ? '(optional)' : '(required)'}
              </label>
              <input
                {...register('isbn')}
                className="input-field"
                placeholder={isbnOptional ? 'Auto SKU if empty' : '978…'}
              />
              {errors.isbn && (
                <p className="mt-1.5 text-small text-error">{errors.isbn.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">Stock</label>
              <input type="number" min="0" {...register('stock')} className="input-field" />
              {errors.stock && (
                <p className="mt-1.5 text-small text-error">{errors.stock.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-small font-semibold text-ink-muted">
              Description
            </label>
            <textarea
              {...register('description')}
              className="input-field min-h-[6rem]"
              rows={4}
              placeholder="Edition, size, material, condition…"
            />
            {errors.description && (
              <p className="mt-1.5 text-small text-error">{errors.description.message}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-6">
            <Button type="submit" disabled={isLoading || !productImage}>
              {isLoading ? 'Publishing…' : 'Publish listing'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/seller/books')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </SellerLayout>
  )
}
