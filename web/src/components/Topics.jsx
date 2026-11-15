import { useState } from 'react'
import { COMFORT, SOURCES, TOPICS } from '../data/content.js'
import SupportBanner from './SupportBanner.jsx'

const EMPTY_ANSWER = { details: [], comfort: 'self', note: '' }

function TopicCard({ topic, answer, open, onToggleOpen, onChange }) {
  const a = answer || EMPTY_ANSWER
  const count = a.details.length
  const flags = new Set(topic.details.filter((d) => d.flag && a.details.includes(d.id)).map((d) => d.flag))
  const panelId = `topic-${topic.id}`

  const toggleDetail = (id) => {
    const details = a.details.includes(id) ? a.details.filter((d) => d !== id) : [...a.details, id]
    onChange({ details })
  }

  return (
    <article className={`topic ${open ? 'topic-open' : ''} ${count ? 'topic-has' : ''}`}>
      <button className="topic-head" aria-expanded={open} aria-controls={panelId} onClick={onToggleOpen}>
        <span className="topic-title">{topic.title}</span>
        <span className="topic-meta">
          {count > 0 && <span className="pill">{count} selected</span>}
          <span className="chev" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </span>
      </button>

      {open && (
        <div className="topic-body" id={panelId}>
          <p className="topic-blurb">
            {topic.blurb}
            {topic.source && (
              <>
                {' '}
                <a className="source" href={SOURCES[topic.source].url} target="_blank" rel="noreferrer">
                  ({SOURCES[topic.source].short})
                </a>
              </>
            )}
          </p>

          <div className="checks" role="group" aria-label={`${topic.short}: what applies`}>
            {topic.details.map((d) => {
              const on = a.details.includes(d.id)
              return (
                <label key={d.id} className={`check ${on ? 'check-on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleDetail(d.id)} />
                  <span className="box" aria-hidden="true" />
                  <span>{d.label}</span>
                </label>
              )
            })}
          </div>

          {flags.has('crisis') && <SupportBanner kind="crisis" />}
          {flags.has('safety') && <SupportBanner kind="safety" />}

          {count > 0 && (
            <>
              <fieldset className="field comfort">
                <legend className="field-label">How would you like to handle this?</legend>
                <div className="chips" role="radiogroup">
                  {COMFORT.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      role="radio"
                      aria-checked={a.comfort === c.id}
                      className={`chip ${a.comfort === c.id ? 'chip-on' : ''}`}
                      onClick={() => onChange({ comfort: c.id })}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label className="field-label" htmlFor={`${panelId}-note`}>
                  Anything to add, in your own words? <span className="muted">(optional)</span>
                </label>
                <textarea
                  id={`${panelId}-note`}
                  className="input"
                  rows={2}
                  value={a.note}
                  onChange={(e) => onChange({ note: e.target.value })}
                />
              </div>
            </>
          )}
        </div>
      )}
    </article>
  )
}

export default function Topics({ answers, onChange, onBack, onNext }) {
  const [openId, setOpenId] = useState(TOPICS[0].id)
  const total = TOPICS.filter((t) => answers[t.id]?.details.length).length

  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Step 2 of 4</p>
        <h1>The harder topics</h1>
        <p className="lede">
          These are things people often leave out. Open any that might apply and tap what fits. Nothing here is
          required, and you decide what gets discussed.
        </p>
      </header>

      <div className="topics">
        {TOPICS.map((t) => (
          <TopicCard
            key={t.id}
            topic={t}
            answer={answers[t.id]}
            open={openId === t.id}
            onToggleOpen={() => setOpenId(openId === t.id ? null : t.id)}
            onChange={(patch) => onChange(t.id, patch)}
          />
        ))}
      </div>

      <div className="nav-row">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          {total ? `Next: pick priorities (${total} topic${total > 1 ? 's' : ''}) →` : 'Next →'}
        </button>
      </div>
    </section>
  )
}
