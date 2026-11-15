import { SOURCES } from '../data/content.js'

export default function Welcome({ onStart, onSample, hasProgress }) {
  const src = SOURCES.levy2018
  return (
    <section className="welcome">
      <div className="welcome-hero">
        <p className="eyebrow">A private checklist for your next appointment</p>
        <h1>
          Say the hard part <em>before</em> the door opens.
        </h1>
        <p className="lede">
          Appointments are short, and some things are hard to say out loud. Answer a few questions now, at your own
          pace, and walk in with a short card that says it for you.
        </p>
        <div className="welcome-actions">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            {hasProgress ? 'Continue where I left off' : 'Start, about 5 minutes'}
          </button>
          <button className="btn btn-ghost" onClick={onSample}>
            See an example visit card
          </button>
        </div>
      </div>

      <div className="welcome-grid">
        <article className="stat-card">
          <p className="stat">61–81%</p>
          <p>
            of adults in two national surveys said they had held back at least one thing relevant to their health
            from a clinician. The most common reason was not wanting to be judged or lectured.
          </p>
          <a className="source" href={src.url} target="_blank" rel="noreferrer">
            {src.short}
          </a>
        </article>
        <article className="how-card">
          <h2>How it works</h2>
          <ol className="how-list">
            <li>
              <strong>The basics.</strong> Why you're coming in and what you take.
            </li>
            <li>
              <strong>The harder topics.</strong> Tap only what applies. Skip anything.
            </li>
            <li>
              <strong>Your top three.</strong> Visits are short, so pick what matters most.
            </li>
            <li>
              <strong>Your visit card.</strong> Words you can read aloud, plus a summary to show or send your
              clinician.
            </li>
          </ol>
        </article>
        <article className="privacy-card">
          <h2>Private by design</h2>
          <p>
            No account and no server. Your answers live only in this browser tab and disappear when you close it or
            press <strong>Quick exit</strong>.
          </p>
        </article>
      </div>
    </section>
  )
}
