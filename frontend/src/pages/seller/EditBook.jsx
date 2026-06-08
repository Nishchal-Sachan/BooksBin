import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProductImageUpload from '../../components/ui/ProductImageUpload'
import api from '../../store/api/api'
import { BOOK_CATEGORIES, isIsbnOptional } from '../../utils/bookHelpers'

const schema = z
  .object({
    title: z.string().min(2),
    author: z.string().min(2),
    price: z.coerce.number().positive(),
    isbn: z.string().optional(),
    stock: z.coerce.number().int().nonnegative(),
    category: z.string().min(2),
    description: z.string().optional(),
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

function imageFromBook(b) {
  const img = b?.images?.[0]
  if (!img) return null
  if (typeof img === 'string') return { url: img, isPrimary: true }
  return {
    url: img.url,
    publicId: img.publicId,
    isPrimary: true,
  }
}

export default function EditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [productImage, setProductImage] = useState(null)
  const [originalPublicId, setOriginalPublicId] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) })

  const category = watch('category')
  const isbnOptional = category ? isIsbnOptional(category) : false

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => {
        const b = res.data.book
        const img = imageFromBook(b)
        setProductImage(img)
        setOriginalPublicId(img?.publicId || null)
        reset({
          title: b.title,
          author: b.author,
          price: b.price,
          isbn: b.isbn,
          stock: b.stock,
          category: b.category || '',
          description: b.description || '',
        })
      })
      .catch(() => {
        toast.error('Product not found')
        navigate('/seller/books')
      })
      .finally(() => setIsLoading(false))
  }, [id, navigate, reset])

  const onSubmit = async (data) => {
    if (!productImage?.url) {
      toast.error('Product image is required')
      return
    }

    try {
      const payload = {
        title: data.title,
        author: data.author,
        price: data.price,
        isbn: data.isbn,
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
        replaceImagePublicId: originalPublicId,
      }
      await api.put(`/books/${id}`, payload)
      toast.success('Listing updated')
      navigate('/seller/books')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update product')
    }
  }

  return (
    <SellerLayout title="Edit product" subtitle="Update cover image, pricing, and stock.">
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card className="max-w-3xl border-neutral-200 p-6 shadow-card md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <ProductImageUpload
              value={productImage}
              onChange={setProductImage}
              label="Cover image"
            />

            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">Title</label>
              <input {...register('title')} className="input-field" />
              {errors.title && (
                <p className="mt-1.5 text-small text-error">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">Author</label>
              <input {...register('author')} className="input-field" />
              {errors.author && (
                <p className="mt-1.5 text-small text-error">{errors.author.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-small font-semibold text-ink-muted">
                  Price (INR)
                </label>
                <input type="number" step="1" {...register('price')} className="input-field" />
                {errors.price && (
                  <p className="mt-1.5 text-small text-error">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-small font-semibold text-ink-muted">
                  ISBN {isbnOptional ? '(optional)' : '(required)'}
                </label>
                <input {...register('isbn')} className="input-field" />
                {errors.isbn && (
                  <p className="mt-1.5 text-small text-error">{errors.isbn.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-small font-semibold text-ink-muted">Stock</label>
                <input type="number" {...register('stock')} className="input-field" />
                {errors.stock && (
                  <p className="mt-1.5 text-small text-error">{errors.stock.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">Category</label>
              <select {...register('category')} className="select-field">
                {BOOK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-small font-semibold text-ink-muted">
                Description
              </label>
              <textarea
                {...register('description')}
                className="input-field min-h-[6rem]"
                rows={4}
              />
            </div>
            <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-6">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/seller/books')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </SellerLayout>
  )
}
