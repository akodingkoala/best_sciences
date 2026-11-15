import { useEffect, useReducer, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Stepper from './components/Stepper.jsx'
import Welcome from './components/Welcome.jsx'
import Basics from './components/Basics.jsx'
import Topics from './components/Topics.jsx'
import Priorities from './components/Priorities.jsx'
import Summary from './components/Summary.jsx'
import ClinicView from './components/ClinicView.jsx'
import { extractCode } from './lib/share.js'
import { SAMPLE_STATE } from './data/content.js'

const STORAGE_KEY = 'before-you-go:v1'

const EMPTY = {
  step: 'welcome',
  basics: { goals: [] },
  topics: {},
  priorities: [],
  fhirConsent: false,
}

// Tiny hash router: "#/clinic" (optionally "?d=<code>") is the clinic side.
function readRoute() {
  const h = window.location.hash
  if (h.startsWith('#/clinic')) return { clinic: true, code: extractCode(h) }
  return { clinic: false, code: null }
}

function useRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function loadInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    /* storage unavailable: start fresh */
  }
  return EMPTY
}

function reducer(state, action) {
  switch (action.type) {
    case 'go':
      return { ...state, step: action.step }
    case 'basic':
      return { ...state, basics: { ...state.basics, [action.id]: action.value } }
    case 'topic': {
      const prev = state.topics[action.id] || { details: [], comfort: 'self', note: '' }
      const next = { ...prev, ...action.patch }
      const topics = { ...state.topics, [action.id]: next }
      // Drop a topic from priorities if it no longer has anything selected
      const empty = next.details.length === 0 && !next.note.trim()
      const priorities = empty ? state.priorities.filter((p) => p !== action.id) : state.priorities
      return { ...state, topics, priorities }
    }
    case 'consent':
      return { ...state, fhirConsent: action.value }
    case 'priorities':
      return { ...state, priorities: action.value }
    case 'sample':
      return { ...EMPTY, ...structuredClone(SAMPLE_STATE), step: 'summary' }
    case 'reset':
      return { ...EMPTY }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)
  const mainRef = useRef(null)
  const route = useRoute()

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  // Move to top and focus the new step for screen readers
  useEffect(() => {
    window.scrollTo({ top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [state.step, route.clinic, route.code])

  const go = (step) => dispatch({ type: 'go', step })

  const quickExit = () => {
    try {
      sessionStorage.clear()
    } catch {
      /* ignore */
    }
    window.location.replace('https://www.google.com')
  }

  if (route.clinic) {
    return (
      <div className="app app-clinic">
        <Header clinic onHome={() => (window.location.hash = '')} />
        <main ref={mainRef} tabIndex={-1} className="main">
          <ClinicView
            code={route.code}
            onCode={(code) => (window.location.hash = `#/clinic?d=${code}`)}
            onClear={() => (window.location.hash = '#/clinic')}
          />
        </main>
        <footer className="footer">
          <p>
            Prototype built at HackRx 2026. Scanned data stays in this browser page and is never uploaded. FHIR
            export follows the patient's choice.
          </p>
        </footer>
      </div>
    )
  }

  return (
    <div className="app">
      <Header onQuickExit={quickExit} onHome={() => go('welcome')} />
      {state.step !== 'welcome' && <Stepper current={state.step} onGo={go} />}

      <main ref={mainRef} tabIndex={-1} className="main">
        {state.step === 'welcome' && (
          <Welcome
            onStart={() => go('basics')}
            onSample={() => dispatch({ type: 'sample' })}
            hasProgress={Object.keys(state.topics).length > 0 || !!state.basics.reason}
          />
        )}
        {state.step === 'basics' && (
          <Basics
            values={state.basics}
            onChange={(id, value) => dispatch({ type: 'basic', id, value })}
            onNext={() => go('topics')}
          />
        )}
        {state.step === 'topics' && (
          <Topics
            answers={state.topics}
            onChange={(id, patch) => dispatch({ type: 'topic', id, patch })}
            onBack={() => go('basics')}
            onNext={() => go('priorities')}
          />
        )}
        {state.step === 'priorities' && (
          <Priorities
            state={state}
            onChange={(value) => dispatch({ type: 'priorities', value })}
            onBack={() => go('topics')}
            onNext={() => go('summary')}
          />
        )}
        {state.step === 'summary' && (
          <Summary
            state={state}
            onEdit={() => go('topics')}
            onReset={() => dispatch({ type: 'reset' })}
            onConsent={(value) => dispatch({ type: 'consent', value })}
          />
        )}
      </main>

      <footer className="footer">
        <p>
          Prototype built at HackRx 2026. Not medical advice and not a substitute for care. Your answers stay
          in this browser tab. They are only sent to an AI service if you use "Ask about my card" on your visit
          card. In an emergency, call 911.
        </p>
        <p className="footer-link">
          <a href="#/clinic">Clinic staff: open the scanner</a>
        </p>
      </footer>
    </div>
  )
}
