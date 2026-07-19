import { useState, useRef } from 'react'

const initialForm = {
  player: '',
  score: '',
  power: '',
}

/* ── Password Gate ─────────────────────────────────────── */
function PasswordGate({ onUnlock }) {
  const [pwd, setPwd] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef(null)

  const handleUnlock = (e) => {
    e.preventDefault()
    if (!pwd.trim()) return
    onUnlock(pwd)
  }

  // called back from parent if the password was rejected
  const shake = () => {
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
    setPwd('')
    inputRef.current?.focus()
  }

  // expose shake so parent can trigger it
  PasswordGate.shake = shake

  return (
    <div className="pwd-gate-overlay" role="dialog" aria-modal="true" aria-label="Score submission locked">
      <div className={`pwd-gate-card glass${shaking ? ' shake' : ''}`}>
        <div className="pwd-gate-icon" aria-hidden="true">🔒</div>
        <h2 className="pwd-gate-title">Secure Zone</h2>
        <p className="pwd-gate-subtitle">
          Enter the master password to submit your punch score.
        </p>
        <form onSubmit={handleUnlock} className="pwd-gate-form">
          <input
            ref={inputRef}
            id="pwd-gate-input"
            type="password"
            className="pwd-gate-input"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Master password"
            autoComplete="current-password"
            required
            autoFocus
          />
          <button type="submit" className="pwd-gate-btn">
            Unlock &amp; Submit
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Score Form ────────────────────────────────────────── */
export function ScoreForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm)
  const [gateOpen, setGateOpen] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const gateRef = useRef(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  // First click: open the password gate
  const handleFormSubmit = (event) => {
    event.preventDefault()
    setPasswordError('')
    setGateOpen(true)
  }

  // Gate submits the password → we try to submit the score
  const handleUnlock = async (password) => {
    setPasswordError('')
    setGateOpen(false)
    try {
      await onSubmit(form, password)
      setForm(initialForm)
    } catch (err) {
      const msg = err?.message ?? ''
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        setPasswordError('Wrong password — try again.')
        setGateOpen(true) // reopen gate
        // trigger shake on next render cycle
        setTimeout(() => PasswordGate.shake?.(), 50)
      }
      // other errors are surfaced by App's error banner already
    }
  }

  return (
    <>
      {gateOpen && <PasswordGate onUnlock={handleUnlock} ref={gateRef} />}

      <form className="score-form" onSubmit={handleFormSubmit}>
        <h2>Log Your Punch</h2>
        <p>Drop your best hit and challenge the leaderboard.</p>

        {passwordError && (
          <p className="pwd-error" role="alert">{passwordError}</p>
        )}

        <label>
          Fighter Name
          <input
            name="player"
            value={form.player}
            onChange={handleChange}
            placeholder="e.g. Neon Crusher"
            maxLength={20}
            required
          />
        </label>

        <label>
          Punch Score
          <input
            name="score"
            value={form.score}
            onChange={handleChange}
            type="number"
            min={1}
            max={999}
            placeholder="0 - 999"
            required
          />
        </label>

        <label>
          Signature Move
          <input
            name="power"
            value={form.power}
            onChange={handleChange}
            maxLength={28}
            placeholder="Meteor Uppercut"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Charging...' : 'Submit Score 🔒'}
        </button>
      </form>
    </>
  )
}
