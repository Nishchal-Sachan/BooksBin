import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../store/api/api'
import { uploadImageToCloudinary, validateImageFile } from '../../utils/upload'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ✅ Schema fix: category & description required by backend, isbn length >= 10
const schema = z.object({
  title: z.string().min(2, "Title is required"),
  author: z.string().min(2, "Author is required"),
  price: z.coerce.number().positive("Price must be positive"),
  isbn: z.string().min(10, "Enter a valid ISBN"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description is required"),
  imageUrl: z.string().url('Enter a valid image URL').optional(),
})

const AddBook = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth) // ✅ ensure seller ID is included
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) })
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')

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
        // ✅ returns { url, publicId } from Cloudinary helper
        const uploadRes = await uploadImageToCloudinary(file)
        imageUrl = uploadRes?.url
      }

      const payload = {
        title: data.title,
        author: data.author,
        price: data.price,
        isbn: data.isbn,
        stock: data.stock,
        category: data.category,
        description: data.description,
        images: imageUrl ? [{ url: imageUrl, isPrimary: true }] : [],
        seller: user?._id || undefined, // ✅ required in backend
      }

      const res = await api.post('/books', payload)
      toast.success('Book added successfully!')
      reset()
      navigate('/seller/books')
    } catch (e) {
      console.error(e)
      toast.error(e.response?.data?.message || 'Failed to add book')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Book</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input {...register('title')} className="mt-1 input" placeholder="Book title" />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input {...register('author')} className="mt-1 input" placeholder="Author" />
            {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input type="number" step="0.01" {...register('price')} className="mt-1 input" placeholder="0.00" />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ISBN</label>
              <input {...register('isbn')} className="mt-1 input" placeholder="ISBN" />
              {errors.isbn && <p className="text-sm text-red-600 mt-1">{errors.isbn.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" {...register('stock')} className="mt-1 input" placeholder="0" />
              {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input {...register('category')} className="mt-1 input" placeholder="Category" />
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea {...register('description')} className="mt-1 input" rows={4} placeholder="Description" />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input {...register('imageUrl')} className="mt-1 input" placeholder="https://..." />
            {errors.imageUrl && <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Or Upload Image (JPG/PNG, max 2MB)</label>
            <input 
              type="file" 
              accept="image/jpeg,image/png" 
              onChange={(e) => { setFileError(''); setFile(e.target.files?.[0] || null) }} 
              className="mt-1 block w-full text-sm" 
            />
            {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="px-4 py-2 rounded-md bg-primary-600 text-white disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBook
