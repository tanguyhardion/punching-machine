import { mockScores } from '../data/mockScores'

const latency = (delay = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

/**
 * Temporary in-memory state that mimics backend responses.
 * Replace these methods with calls to your Vercel API + Supabase.
 */
let scores = [...mockScores]

export const scoresApi = {
  async list() {
    await latency()
    return [...scores]
  },

  async create(payload) {
    await latency(200)

    const newEntry = {
      id: crypto.randomUUID(),
      player: payload.player.trim(),
      score: Number(payload.score),
      power: payload.power.trim() || 'Arcade Smash',
      createdAt: new Date().toISOString(),
    }

    scores = [newEntry, ...scores]
    return newEntry
  },
}
