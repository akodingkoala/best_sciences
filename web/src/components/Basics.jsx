import { BASICS } from '../data/content.js'

function Field({ q, value, onChange }) {
  const id = `q-${q.id}`
  if (q.type === 'single' || q.type === 'multi') {
    const multi = q.type === 'multi'
    const selected = multi ? value || [] : value
    const toggle = (opt) => {
      if (multi) {
        onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt])
      } else {
        onChange(selected === opt ? '' : opt)
      }
    }
    return (
      <fieldset className="field">
        <legend className="field-label">{q.label}</legend>
        {q.hint && <p className="field-hint">{q.hint}</p>}
        <div className="chips" role={multi ? 'group' : 'radiogroup'}>
          {q.options.map((opt) => {
            const on = multi ? selected.includes(opt) : selected === opt
            return (
              <button
                type="button"
                key={opt}
                className={`chip ${on ? 'chip-on' : ''}`}
                role={multi ? 'checkbox' : 'radio'}
                aria-checked={on}
                onClick={() => toggle(opt)}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }

  const Tag = q.type === 'textarea' ? 'textarea' : 'input'
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {q.label}
      </label>
      {q.hint && <p className="field-hint">{q.hint}</p>}
      <Tag
        id={id}
        className="input"
        rows={q.type === 'textarea' ? 3 : undefined}
        placeholder={q.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default function Basics({ values, onChange, onNext }) {
  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Step 1 of 4</p>
        <h1>The basics</h1>
        <p className="lede">Everything is optional. Answer what you can.</p>
      </header>

      <div className="fields">
        {BASICS.map((q) => (
          <Field key={q.id} q={q} value={values[q.id]} onChange={(v) => onChange(q.id, v)} />
        ))}
      </div>

      <div className="nav-row">
        <span />
        <button className="btn btn-primary" onClick={onNext}>
          Next: harder topics →
        </button>
      </div>
    </section>
  )
}
