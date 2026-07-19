import { useState } from 'react'
import { formatScore, formatTime } from '../utils/format'

export function Leaderboard({ entries, onDelete, cachedPassword }) {
  const [deletingId, setDeletingId] = useState(null)
  const [showGate, setShowGate] = useState(false)
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  const handleDeleteClick = async (id) => {
    if (cachedPassword?.current) {
      try {
        await onDelete(id, cachedPassword.current)
      } catch (err) {
        // If cached password failed (e.g. changed or invalid), open gate
        setDeletingId(id)
        setShowGate(true)
      }
    } else {
      setDeletingId(id)
      setShowGate(true)
    }
  }

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (!pwd.trim()) return
    setError('')
    try {
      await onDelete(deletingId, pwd)
      setShowGate(false)
      setDeletingId(null)
      setPwd('')
    } catch (err) {
      setError('Wrong password — try again.')
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
      setPwd('')
    }
  }

  return (
    <section className="leaderboard" aria-label="Punching machine leaderboard">
      <div className="leaderboard-header">
        <h2>Arcade Rankings</h2>
        <span>Live board</span>
      </div>

      <ol>
        {entries.map((entry, index) => (
          <li key={entry.id} className={index < 3 ? 'podium' : ''}>
            <span className="position">#{index + 1}</span>
            <div className="fighter-details">
              <strong>{entry.player}</strong>
              <small>{entry.power}</small>
            </div>
            <span className="score">{formatScore(entry.score)}</span>
            <time>{formatTime(entry.createdAt)}</time>
            <button
              className="delete-btn"
              onClick={() => handleDeleteClick(entry.id)}
              title="Delete Score"
              aria-label={`Delete score for ${entry.player}`}
            >
              🗑️
            </button>
          </li>
        ))}
      </ol>

      {showGate && (
        <div className="pwd-gate-overlay" role="dialog" aria-modal="true" aria-label="Confirm deletion password">
          <div className={`pwd-gate-card glass${shaking ? ' shake' : ''}`}>
            <div className="pwd-gate-icon" aria-hidden="true">⚠️</div>
            <h2 className="pwd-gate-title">Authorize Delete</h2>
            <p className="pwd-gate-subtitle">
              Enter the master password to delete this entry.
            </p>
            {error && <p className="pwd-error" role="alert">{error}</p>}
            <form onSubmit={handleUnlock} className="pwd-gate-form">
              <input
                type="password"
                className="pwd-gate-input"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Master password"
                autoComplete="current-password"
                required
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="pwd-gate-btn">
                  Confirm
                </button>
                <button
                  type="button"
                  className="pwd-gate-btn"
                  style={{
                    background: 'linear-gradient(95deg, #ff5f6d, #ffc371)',
                    color: '#fff',
                  }}
                  onClick={() => {
                    setShowGate(false)
                    setDeletingId(null)
                    setPwd('')
                    setError('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

