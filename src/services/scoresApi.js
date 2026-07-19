const API_URL = import.meta.env.VITE_API_URL || ''
const BASE_URL = `${API_URL}/api/scores`

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
   * @param {string} password  Master submit password
   */
  async create(payload, password) {
    return apiFetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Submit-Password': password ?? '',
      },
      body: JSON.stringify({
        player: payload.player,
        score: payload.score,
        power: payload.power,
      }),
    })
  },

  /**
   * Deletes a score entry by id.
   * @param {string} id  UUID of the entry to delete
   * @param {string} password  Master submit password
   */
  async delete(id, password) {
    return apiFetch(`${BASE_URL}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'X-Submit-Password': password ?? '',
      },
    })
  },
}

