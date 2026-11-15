export default function Header({ onQuickExit, onHome, clinic = false }) {
  return (
    <header className="header">
      <button className="brand" onClick={onHome} aria-label="Before You Go, back to start">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect x="3" y="5" width="26" height="22" rx="6" fill="currentColor" opacity="0.14" />
            <path d="M9 13h14M9 18h9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="23" cy="18" r="2.2" fill="var(--clay)" />
          </svg>
        </span>
        <span className="brand-name">Before You Go</span>
        {clinic && <span className="pill clinic-pill">Clinic</span>}
      </button>
      {clinic ? (
        <a className="btn btn-ghost btn-sm" href="#">
          Patient side
        </a>
      ) : (
        <button className="quick-exit" onClick={onQuickExit} title="Clears your answers and goes to google.com">
          Quick exit
        </button>
      )}
    </header>
  )
}
