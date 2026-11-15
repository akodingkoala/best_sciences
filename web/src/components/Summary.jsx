import { useMemo, useState } from 'react'
import { buildSummary, summaryToText } from '../lib/summary.js'
import SupportBanner from './SupportBanner.jsx'
import ShareQR from './ShareQR.jsx'
import ChatWidget from './ChatWidget.jsx'

function PatientView({ summary }) {
  const { discuss, noteOnly, questions } = summary
  return (
    <div className="card-view">
      {discuss.length === 0 && questions.length === 0 && (
        <p className="muted">
          Nothing flagged yet. Your card will fill in as you add topics or questions.
        </p>
      )}

      {discuss.length > 0 && (
        <ol className="talk-list">
          {discuss.map((item, n) => (
            <li key={item.id} className={`talk ${item.urgent ? 'talk-urgent' : ''}`}>
              <div className="talk-head">
                <span className="talk-num">{n + 1}</span>
                <h3>{item.short}</h3>
                {item.urgent && <span className="pill pill-clay">Raise early</span>}
                {!item.urgent && summary.prioritySet.has(item.id) && <span className="pill">Top priority</span>}
              </div>
              <p className="talk-say">You could say:</p>
              <ul className="starters">
                {item.starters.map((s) => (
                  <li key={s}>“{s}”</li>
                ))}
              </ul>
              {item.note && <p className="talk-note">Your note: {item.note}</p>}
            </li>
          ))}
        </ol>
      )}

      {questions.length > 0 && (
        <div className="card-block">
          <h3>My questions</h3>
          <ul className="plain">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {noteOnly.length > 0 && (
        <div className="card-block">
          <h3>On my card, but not for today</h3>
          <p className="muted">
            Your clinician will see these in the summary. You don't have to discuss them unless you want to.
          </p>
          <ul className="plain">
            {noteOnly.map((i) => (
              <li key={i.id}>
                <strong>{i.short}:</strong> {i.details.join('; ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function ClinicianView({ summary }) {
  const { basics, discuss, noteOnly, questions } = summary
  return (
    <div className="clin-view">
      <p className="clin-label">Pre-visit summary · completed by patient</p>
      <dl className="clin-basics">
        {basics
          .filter((b) => b.id !== 'questions')
          .map((b) => (
            <div key={b.id}>
              <dt>{b.label}</dt>
              <dd>{b.value}</dd>
            </div>
          ))}
      </dl>

      {discuss.length > 0 && (
        <>
          <h3>Topics to discuss, in patient's priority order</h3>
          <table className="clin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Topic</th>
                <th>Patient reports</th>
                <th>Preference</th>
              </tr>
            </thead>
            <tbody>
              {discuss.map((i, n) => (
                <tr key={i.id} className={i.urgent ? 'row-urgent' : ''}>
                  <td>{n + 1}</td>
                  <td>
                    {i.short}
                    {i.urgent && <span className="pill pill-clay">Raise early</span>}
                  </td>
                  <td>
                    <ul className="plain">
                      {i.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {i.note && <p className="clin-note">“{i.note}”</p>}
                  </td>
                  <td>{i.comfort.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {noteOnly.length > 0 && (
        <>
          <h3>For awareness only</h3>
          <ul className="plain">
            {noteOnly.map((i) => (
              <li key={i.id}>
                <strong>{i.short}:</strong> {i.details.join('; ')}
                {i.note && <> (“{i.note}”)</>}
              </li>
            ))}
          </ul>
        </>
      )}

      {questions.length > 0 && (
        <>
          <h3>Patient's questions</h3>
          <ul className="plain">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default function Summary({ state, onEdit, onReset, onConsent }) {
  const summary = useMemo(() => buildSummary(state), [state])
  const chatContext = useMemo(() => summaryToText(summary), [summary])
  const [view, setView] = useState('patient')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryToText(summary))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="panel panel-wide">
      <header className="panel-head no-print">
        <p className="eyebrow">Step 4 of 4</p>
        <h1>Your visit card</h1>
        <p className="lede">
          Read from it in the room, show it on your phone, or send the clinician summary through your patient
          portal before the visit.
        </p>
      </header>

      {summary.flags.has('crisis') && <SupportBanner kind="crisis" />}
      {summary.flags.has('safety') && <SupportBanner kind="safety" />}

      <div className="tabs no-print" role="tablist">
        <button
          role="tab"
          aria-selected={view === 'patient'}
          className={`tab ${view === 'patient' ? 'tab-on' : ''}`}
          onClick={() => setView('patient')}
        >
          What to say
        </button>
        <button
          role="tab"
          aria-selected={view === 'clinician'}
          className={`tab ${view === 'clinician' ? 'tab-on' : ''}`}
          onClick={() => setView('clinician')}
        >
          For my clinician
        </button>
      </div>

      <div className="sheet" role="tabpanel">
        {view === 'patient' ? <PatientView summary={summary} /> : <ClinicianView summary={summary} />}
      </div>

      <ShareQR state={state} consent={!!state.fhirConsent} onConsent={onConsent} />

      <div className="action-row no-print">
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print or save as PDF
        </button>
        <button className="btn btn-secondary" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy clinician summary'}
        </button>
        <button className="btn btn-ghost" onClick={onEdit}>
          Edit answers
        </button>
        <button
          className="btn btn-ghost btn-danger"
          onClick={() => {
            if (window.confirm('Clear all answers and start over?')) onReset()
          }}
        >
          Start over
        </button>
      </div>

      <ChatWidget context={chatContext} />
    </section>
  )
}
