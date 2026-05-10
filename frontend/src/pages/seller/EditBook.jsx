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
import { getSellerBooks, updateSellerBook } from '../../utils/sellerMockStore'

const schema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  price: z.coerce.number().positive(),
  isbn: z.string().min(5),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val?.trim() || z.string().url().safeParse(val).success,
      'Enter a valid image URL'
    ),
})

function coverFromBook(b) {
  const img = b?.images?.[0]
  if (!img) return ''
  return typeof img === 'string' ? img : img?.url || ''
}

export default function EditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema), defaultValues: { imageUrl: '' } })

  useEffect(() => {
    const books = getSellerBooks()
    const b = books.find((x) => x._id === id)
    if (!b) {
      toast.error('Book not found')
      navigate('/seller/books')
      return
    }
    reset({
      title: b.title,
      author: b.author,
      price: b.price,
      isbn: b.isbn,
      stock: b.stock,
      category: b.category || '',
      description: b.description || '',
      imageUrl: coverFromBook(b),
    })
    setIsLoading(false)
  }, [id, navigate, reset])

  const onSubmit = async (data) => {
    const books = getSellerBooks()
    const existing = books.find((x) => x._id === id)
    const url = data.imageUrl?.trim()
    const images =
      url && url.length > 0
        ? [url]
        : existing?.images?.length
          ? existing.images
          : ['/placeholder-book.jpg']

    updateSellerBook(id, {
      title: data.title,
      author: data.author,
      price: data.price,
      isbn: data.isbn,
      stock: data.stock,
      category: data.category,
      description: data.description,
      images,
    })
    toast.success('Book updated')
    navigate('/seller/books')
  }

  return (
    <SellerLayout
      title="Edit book"
      subtitle="Update listing details and stock. Changes apply to your demo catalog immediately."
    >
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card className="max-w-3xl border-neutral-200/90 p-6 shadow-card md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-small font-medium text-neutral-700">
                Title
              </label>
              <input {...register('title')} className="input-field" />
              {errors.title && (
                <p className="mt-1.5 text-small text-error" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-small font-medium text-neutral-700">
                Author
              </label>
              <input {...register('author')} className="input-field" />
              {errors.author && (
                <p className="mt-1.5 text-small text-error" role="alert">
                  {errors.author.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-small font-medium text-neutral-700">
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className="input-field"
                />
                {errors.price && (
                  <p className="mt-1.5 text-small text-error" role="alert">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-small font-medium text-neutral-700">
                  ISBN
                </label>
                <input {...register('isbn')} className="input-field" />
                {errors.isbn && (
                  <p className="mt-1.5 text-small text-error" role="alert">
                    {errors.isbn.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-small font-medium text-neutral-700">
                  Stock
                </label>
                <input type="number" {...register('stock')} className="input-field" />
                {errors.stock && (
                  <p className="mt-1.5 text-small text-error" role="alert">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-small font-medium text-neutral-700">
                Category
              </label>
              <input {...register('category')} className="input-field" />
            </div>
            <div>
              <label className="mb-2 block text-small font-medium text-neutral-700">
                Description
              </label>
              <textarea
                {...register('description')}
                className="input-field min-h-[6rem]"
                rows={4}
              />
            </div>
            <div>
              <label className="mb-2 block text-small font-medium text-neutral-700">
                Cover image URL
              </label>
              <input {...register('imageUrl')} className="input-field" />
              {errors.imageUrl && (
                <p className="mt-1.5 text-small text-error" role="alert">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6">
              <Button type="submit">Save changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/seller/books')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </SellerLayout>
  )
}
