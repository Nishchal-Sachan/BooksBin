import api from '../store/api/api'

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No file selected' }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, or WebP images are allowed' }
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: 'Image must be smaller than 5 MB' }
  }
  return { valid: true }
}

/** Upload via authenticated backend → Cloudinary (production flow) */
export async function uploadProductImage(file) {
  const check = validateImageFile(file)
  if (!check.valid) throw new Error(check.error)

  const formData = new FormData()
  formData.append('image', file)

  const { data } = await api.post('/upload/product-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data.image
}
