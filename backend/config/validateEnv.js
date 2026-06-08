function validateEnv() {
  const required = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn(
      '[BooksBin] CLOUDINARY_* not set — seller image uploads will be unavailable until configured.'
    )
  }

  if (!process.env.SELLER_EMAIL) {
    console.warn('[BooksBin] SELLER_EMAIL not set — run seed after adding seller credentials.')
  }
}

module.exports = validateEnv
