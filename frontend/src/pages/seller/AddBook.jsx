import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { addSellerBook } from '../../utils/sellerMockStore'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  author: z.string().min(2, 'Author is required'),
  price: z.coerce.number().positive('Price must be positive'),
  isbn: z.string().min(10, 'Enter a valid ISBN'),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description is required'),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val?.trim() || z.string().url().safeParse(val).success,
      'Enter a valid image URL'
    ),
})

const categories = [
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
  'Other',
]

export default function AddBook() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { imageUrl: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    const url = data.imageUrl?.trim()
    const images = url
      ? [url]
      : [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
        ]
    addSellerBook({
      title: data.title,
      author: data.author,
      price: data.price,
      isbn: data.isbn,
      stock: data.stock,
      category: data.category,
      description: data.description,
      images,
    })
    toast.success('Book added to your catalog')
    reset()
    navigate('/seller/books')
    setIsLoading(false)
  }

  return (
    <SellerLayout
      title="Add book"
      subtitle="Create a new listing. Cover image is optional — a placeholder is used if you skip the URL."
    >
      <Card className="max-w-3xl border-neutral-200/90 p-6 shadow-card md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-small font-medium text-neutral-700">
              Title
            </label>
            <input
              {...register('title')}
              className="input-field"
              placeholder="Book title"
            />
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
            <input
              {...register('author')}
              className="input-field"
              placeholder="Author"
            />
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
                placeholder="0.00"
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
            <select {...register('category')} className="select-field">
              <option value="">— Select —</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-small text-error" role="alert">
                {errors.category.message}
              </p>
            )}
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
            {errors.description && (
              <p className="mt-1.5 text-small text-error" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-small font-medium text-neutral-700">
              Cover image URL (optional)
            </label>
            <input
              {...register('imageUrl')}
              className="input-field"
              placeholder="https://…"
            />
            {errors.imageUrl && (
              <p className="mt-1.5 text-small text-error" role="alert">
                {errors.imageUrl.message}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save listing'}
            </Button>
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
    </SellerLayout>
  )
}
