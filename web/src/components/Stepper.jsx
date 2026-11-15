import { STEPS } from '../lib/steps.js'

export default function Stepper({ current, onGo }) {
  const idx = STEPS.findIndex((s) => s.id === current)
  return (
    <nav className="stepper" aria-label="Progress">
      <ol>
        {STEPS.map((s, i) => {
          const state = i < idx ? 'done' : i === idx ? 'current' : 'todo'
          return (
            <li key={s.id} className={`step step-${state}`}>
              <button
                onClick={() => onGo(s.id)}
                disabled={state === 'todo'}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span className="step-num">{state === 'done' ? '✓' : i + 1}</span>
                <span className="step-label">{s.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
