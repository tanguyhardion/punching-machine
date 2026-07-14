const BASE_URL = '/api/scores'

/**
 * Fetches with a timeout and parses the JSON response.
 * Throws a unified Error for both HTTP errors and network failures.
 */
async function apiFetch(url, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      // Surface a generic message; do not log server-side details to console.
      throw new Error(`Request failed (${res.status})`)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

export const scoresApi = {
  /** Returns all scores sorted by score descending (from the backend). */
  async list() {
    return apiFetch(BASE_URL)
  },

  /**
   * Creates a new score entry.
   * @param {{ player: string, score: number|string, power?: string }} payload
   */
  async create(payload) {
    return apiFetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: payload.player,
        score: payload.score,
        power: payload.power,
      }),
    })
  },
}
