const ACCESS_COOKIE = 'accessToken'
const REFRESH_COOKIE = 'refreshToken'

const isProduction = process.env.NODE_ENV === 'production'

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  path: '/',
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
}
