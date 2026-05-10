function key(userId) {
  return `booksbin_profile_draft_${userId || 'guest'}`
}

export function loadProfileDraft(userId) {
  try {
    const raw = localStorage.getItem(key(userId))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveProfileDraft(userId, data) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(data))
  } catch {
    /* ignore */
  }
}
