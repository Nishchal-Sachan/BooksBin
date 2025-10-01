import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../store/api/api'
import { uploadImageToCloudinary, validateImageFile } from '../../utils/upload'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

const schema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  price: z.coerce.number().positive(),
  isbn: z.string().min(5),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url('Enter a valid image URL').optional(),
})

const EditBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) })
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    fetchBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchBook = async () => {
    setIsLoading(true)
    try {
      const res = await api.get(`/books/${id}`)
      const b = res.data.book
      reset({
        title: b.title,
        author: b.author,
        price: b.price,
        isbn: b.isbn,
        stock: b.stock,
        category: b.category || '',
        description: b.description || '',
        imageUrl: b.images?.[0] || '',
      })
    } catch {
      toast.error('Failed to load book')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      let imageUrl = data.imageUrl
      if (file) {
        const validation = validateImageFile(file)
        if (!validation.valid) {
          setFileError(validation.error)
          setIsLoading(false)
          return
        }
        imageUrl = await uploadImageToCloudinary(file)
      }
      const payload = {
        title: data.title,
        author: data.author,
        price: data.price,
        isbn: data.isbn,
        stock: data.stock,
        category: data.category,
        description: data.description,
        images: imageUrl ? [imageUrl] : [],
      }
      await api.put(`/books/${id}`, payload)
      toast.success('Book updated')
      navigate('/seller/books')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Book</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input {...register('title')} className="mt-1 input" />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Or Upload Image (JPG/PNG, max 2MB)</label>
              <input type="file" accept="image/jpeg,image/png" onChange={(e) => { setFileError(''); setFile(e.target.files?.[0] || null) }} className="mt-1 block w-full text-sm" />
              {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input {...register('author')} className="mt-1 input" />
              {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                <input type="number" step="0.01" {...register('price')} className="mt-1 input" />
                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                <input {...register('isbn')} className="mt-1 input" />
                {errors.isbn && <p className="text-sm text-red-600 mt-1">{errors.isbn.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" {...register('stock')} className="mt-1 input" />
                {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input {...register('category')} className="mt-1 input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea {...register('description')} className="mt-1 input" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input {...register('imageUrl')} className="mt-1 input" />
              {errors.imageUrl && <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>}
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-primary-600 text-white disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditBook
