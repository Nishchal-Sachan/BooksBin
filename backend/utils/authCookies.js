const ACCESS_COOKIE = 'accessToken'
const REFRESH_COOKIE = 'refreshToken'

const isProduction = process.env.NODE_ENV === 'production'

// Frontend and API on different domains (e.g. booksbin.store + *.onrender.com)
// require SameSite=None so cookies are sent on cross-origin API requests.
function isCrossOriginDeployment() {
  const urls = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)

  return urls.some((url) => {
    try {
      const host = new URL(url).hostname
      return !host.includes('localhost') && !host.includes('127.0.0.1')
    } catch {
      return false
    }
  })
}

const crossOrigin = isCrossOriginDeployment()

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction || crossOrigin,
  sameSite: crossOrigin ? 'none' : isProduction ? 'strict' : 'lax',
  path: '/',
}

function sessionPayload(user, accessToken, refreshToken) {
  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  }
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions)
  res.clearCookie(REFRESH_COOKIE, baseCookieOptions)
}

function getAccessToken(req) {
  return req.cookies?.[ACCESS_COOKIE] || null
}

function getRefreshToken(req) {
  return req.cookies?.[REFRESH_COOKIE] || null
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  setAuthCookies,
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  sessionPayload,
}
