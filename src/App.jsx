import { useEffect, useMemo, useState } from 'react'
import { Leaderboard } from './components/Leaderboard'
import { ScoreForm } from './components/ScoreForm'
import { ScoreStats } from './components/ScoreStats'
import { scoresApi } from './services/scoresApi'

function App() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flashScore, setFlashScore] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadScores = async () => {
      try {
        const result = await scoresApi.list()
        setEntries(result)
      } catch {
        setError('Failed to load scores. Try again soon.')
      } finally {
        setIsLoading(false)
      }
    }

    loadScores()
  }, [])

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.score - a.score),
    [entries],
  )

  const handleSubmit = async (form, password) => {
    setError('')
    setIsSubmitting(true)

    try {
      const created = await scoresApi.create(form, password)
      setEntries((current) => [created, ...current])
      setFlashScore(created)
      setTimeout(() => setFlashScore(null), 1600)
    } catch (err) {
      const msg = err?.message ?? ''
      if (msg.includes('401')) {
        // Let ScoreForm handle the wrong-password UI; re-throw so it knows
        setIsSubmitting(false)
        throw err
      }
      setError('Score upload interrupted. Retry your punch.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <header className="hero">
        <p className="badge">Arcade Ring</p>
        <h1>Punching Machine Leaderboard</h1>
        <p className="subtitle">
          Track every hit, rise through the rankings, and own the neon arena.
        </p>
      </header>

      <main>
        <ScoreStats entries={sortedEntries} />

        {flashScore && (
          <section className="impact-banner" role="status">
            <p>
              <strong>{flashScore.player}</strong> landed a {flashScore.score} impact!
            </p>
          </section>
        )}

        {error && (
          <section className="error-banner" role="alert">
            {error}
          </section>
        )}

        <section className="arena-grid">
          <ScoreForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          {isLoading ? <p className="loading">Powering the scoreboard...</p> : <Leaderboard entries={sortedEntries} />}
        </section>
      </main>
    </div>
  )
}

export default App
