import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = [
  'What should I bring up first?',
  'Help me say my top priority out loud',
  'What questions could I ask about my sleep?',
]

const GREETING = {
  role: 'assistant',
  content:
    "Hi! I can answer questions about your visit card and look up general health information. I can't give advice on medicines, doses, or prescriptions. That's for your clinician or pharmacist.",
}

/**
 * Floating "Ask about my card" assistant for the visit card page.
 * `context` is the plain-text visit card; it is sent to the server only when the patient asks a question.
 */
export default function ChatWidget({ context }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ask = async (text) => {
    const q = text.trim()
    if (!q || busy) return
    const next = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          context,
          // The greeting is UI only; don't send it.
          messages: next.filter((m) => m !== GREETING && !m.error).map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'The assistant is unavailable right now.')
      setMessages((m) => [...m, { role: 'assistant', content: data.reply, sources: data.sources, guarded: data.guarded }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: e.message, error: true }])
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="chat no-print">
      {open && (
        <section className="chat-panel" role="dialog" aria-label="Ask about my card">
          <header className="chat-head">
            <div>
              <p className="chat-title">Ask about my card</p>
              <p className="chat-sub">Not medical advice · no medicine or dosing advice</p>
            </div>
            <button className="chat-x" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="chat-list" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-${m.role} ${m.error ? 'chat-error' : ''} ${m.guarded ? 'chat-guarded' : ''}`}>
                {m.content.split(/\n{2,}/).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {m.sources?.length > 0 && (
                  <ul className="chat-sources">
                    {m.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noreferrer">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {busy && (
              <div className="chat-msg chat-assistant chat-typing" aria-label="Thinking">
                <span />
                <span />
                <span />
              </div>
            )}
            {messages.length === 1 && !busy && (
              <div className="chat-suggest">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Your question"
              maxLength={1000}
            />
            <button className="btn btn-primary" disabled={busy || !input.trim()}>
              Send
            </button>
          </form>
          <p className="chat-privacy">
            Asking a question sends your visit card to an AI service to answer it. In an emergency, call 911.
          </p>
        </section>
      )}

      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Ask about my card'}
      >
        {open ? (
          '×'
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                fill="currentColor"
                d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              />
            </svg>
            <span>Ask</span>
          </>
        )}
      </button>
    </div>
  )
}
