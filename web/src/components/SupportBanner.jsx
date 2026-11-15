import { SUPPORT } from '../data/content.js'

export default function SupportBanner({ kind }) {
  const s = SUPPORT[kind]
  if (!s) return null
  return (
    <div className={`support support-${kind}`} role="alert">
      <p className="support-title">{s.title}</p>
      <ul>
        {s.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <a href={s.link.href} target="_blank" rel="noreferrer">
        {s.link.label}
      </a>
    </div>
  )
}
