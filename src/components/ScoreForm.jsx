import { useState } from 'react'

const initialForm = {
  player: '',
  score: '',
  power: '',
}

export function ScoreForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit(form)
    setForm(initialForm)
  }

  return (
    <form className="score-form" onSubmit={handleSubmit}>
      <h2>Log Your Punch</h2>
      <p>Drop your best hit and challenge the leaderboard.</p>

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
        {isSubmitting ? 'Charging...' : 'Submit Score'}
      </button>
    </form>
  )
}
