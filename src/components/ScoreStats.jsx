import { formatScore } from '../utils/format'

export function ScoreStats({ entries }) {
  const top = entries[0]?.score ?? 0
  const avg =
    entries.length === 0
      ? 0
      : Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length)

  return (
    <section className="stats-grid" aria-label="Score overview">
      <article>
        <h3>Highest Hit</h3>
        <p>{formatScore(top)}</p>
      </article>
      <article>
        <h3>Average Impact</h3>
        <p>{formatScore(avg)}</p>
      </article>
      <article>
        <h3>Total Fighters</h3>
        <p>{entries.length}</p>
      </article>
    </section>
  )
}
