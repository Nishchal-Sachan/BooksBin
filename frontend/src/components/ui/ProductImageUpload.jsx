import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '../../utils/cn'
import { uploadProductImage, validateImageFile } from '../../utils/upload'

export default function ProductImageUpload({
  value,
  onChange,
  label = 'Product image',
  required = true,
  className,
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file) => {
    const check = validateImageFile(file)
    if (!check.valid) {
      toast.error(check.error)
      return
    }

    setUploading(true)
    try {
      const image = await uploadProductImage(file)
      onChange?.(image)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const clearImage = () => {
    onChange?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={className}>
      <label className="mb-2 block text-small font-semibold text-ink-muted">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>

      {value?.url ? (
        <div className="relative inline-block">
          <img
            src={value.url}
            alt="Product preview"
            className="h-48 w-36 rounded-lg border border-neutral-200 object-cover shadow-soft"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink-muted shadow-card hover:text-error"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-300 bg-surface-subtle hover:border-primary-400 hover:bg-white',
            uploading && 'pointer-events-none opacity-70'
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
          ) : (
            <ImagePlus className="h-8 w-8 text-primary-700" />
          )}
          <span className="mt-3 text-body-sm font-medium text-ink">
            {uploading ? 'Uploading…' : 'Click or drag image here'}
          </span>
          <span className="mt-1 text-small text-ink-muted">
            JPG or PNG, max 5 MB. Stored securely on Cloudinary.
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
      />

      {!value?.url && required && (
        <p className="mt-2 text-small text-ink-muted">
          A cover image is required before publishing.
        </p>
      )}
    </div>
  )
}
