const express = require('express')
const multer = require('multer')
const { authenticate, authorize } = require('../middlewares/auth')
const { isConfigured, uploadProductImage } = require('../services/cloudinary')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, PNG, or WebP images are allowed'))
    }
  },
})

router.post(
  '/product-image',
  authenticate,
  authorize('seller', 'admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!isConfigured()) {
        return res.status(503).json({
          message:
            'Image upload is not configured. Add Cloudinary credentials to the server environment.',
        })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' })
      }

      const result = await uploadProductImage(req.file.buffer)

      res.json({
        message: 'Image uploaded successfully',
        image: {
          url: result.url,
          publicId: result.publicId,
          isPrimary: true,
        },
      })
    } catch (error) {
      console.error('Product image upload error:', error)
      res.status(500).json({
        message: error.message || 'Image upload failed',
      })
    }
  }
)

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 5 MB' : err.message
    return res.status(400).json({ message })
  }
  if (err) {
    return res.status(400).json({ message: err.message })
  }
  next()
})

module.exports = router
