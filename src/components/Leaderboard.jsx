import { formatScore, formatTime } from '../utils/format'

export function Leaderboard({ entries }) {
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
          </li>
        ))}
      </ol>
    </section>
  )
}
