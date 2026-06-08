let accessToken = null
let refreshToken = null

export function getAccessToken() {
  return accessToken
}

export function getRefreshToken() {
  return refreshToken
}

export function setSessionTokens(tokens) {
  if (tokens.accessToken) accessToken = tokens.accessToken
  if (tokens.refreshToken) refreshToken = tokens.refreshToken
}

export function clearSessionTokens() {
  accessToken = null
  refreshToken = null
}
