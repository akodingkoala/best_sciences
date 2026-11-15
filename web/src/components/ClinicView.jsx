import { useEffect, useMemo, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { decodeCode, extractCode } from '../lib/share.js'
import { buildSummary } from '../lib/summary.js'
import { downloadJson, toQuestionnaireResponse } from '../lib/fhir.js'
import { ClinicianView } from './Summary.jsx'

function Scanner({ onCode }) {
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')
  const [paste, setPaste] = useState('')

  const handleText = (text) => {
    const code = extractCode(text)
    if (code) {
      onCode(code)
      return true
    }
    setError("That doesn't look like a Before You Go code.")
    return false
  }

  const stop = () => {
    scannerRef.current?.stop()
    scannerRef.current?.destroy()
    scannerRef.current = null
    setActive(false)
  }

  useEffect(() => stop, [])

  const start = async () => {
    setError('')
    try {
      if (!(await QrScanner.hasCamera())) {
        setError('No camera found. Upload a photo of the code instead.')
        return
      }
      setActive(true)
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          if (extractCode(result.data)) {
            stop()
            onCode(extractCode(result.data))
          }
        },
        { preferredCamera: 'environment', highlightScanRegion: true, highlightCodeOutline: true, returnDetailedScanResult: true },
      )
      scannerRef.current = scanner
      await scanner.start()
    } catch {
      stop()
      setError('Camera access was blocked or unavailable. Cameras need HTTPS (or localhost). You can upload a photo instead.')
    }
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true })
      handleText(result.data)
    } catch {
      setError('No QR code found in that image. Try a closer, sharper photo.')
    }
  }

  return (
    <div className="scanner">
      <div className={`scan-stage ${active ? 'scan-on' : ''}`}>
        <video ref={videoRef} className="scan-video" muted playsInline hidden={!active} />
        {!active && (
          <div className="scan-idle">
            <svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
              <path
                d="M6 16V8a2 2 0 0 1 2-2h8M32 6h8a2 2 0 0 1 2 2v8M42 32v8a2 2 0 0 1-2 2h-8M16 42H8a2 2 0 0 1-2-2v-8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <rect x="15" y="15" width="18" height="18" rx="2" fill="currentColor" opacity="0.2" />
            </svg>
            <p>Point the camera at the patient's code</p>
          </div>
        )}
      </div>

      <div className="scan-actions">
        {active ? (
          <button className="btn btn-ghost" onClick={stop}>
            Stop camera
          </button>
        ) : (
          <button className="btn btn-primary" onClick={start}>
            Start camera
          </button>
        )}
        <label className="btn btn-secondary file-btn">
          Upload a photo of the code
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
      </div>

      <form
        className="paste-row"
        onSubmit={(e) => {
          e.preventDefault()
          handleText(paste)
        }}
      >
        <label htmlFor="paste" className="field-label">
          Or paste a clinic link
        </label>
        <div className="paste-inputs">
          <input
            id="paste"
            className="input"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="https://…#/clinic?d=…"
          />
          <button className="btn btn-ghost" type="submit" disabled={!paste.trim()}>
            Open
          </button>
        </div>
      </form>

      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function Received({ code, onClear }) {
  const decoded = useMemo(() => {
    try {
      return { ok: true, ...decodeCode(code) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [code])
  const [showJson, setShowJson] = useState(false)

  const fhir = useMemo(
    () => (decoded.ok && decoded.fhirConsent ? toQuestionnaireResponse(decoded.state, decoded.createdAt || new Date()) : null),
    [decoded],
  )

  if (!decoded.ok) {
    return (
      <div className="panel">
        <div className="empty">
          <p>{decoded.error}</p>
          <button className="btn btn-primary" onClick={onClear}>
            Scan again
          </button>
        </div>
      </div>
    )
  }

  const summary = buildSummary(decoded.state)

  return (
    <section className="panel panel-wide">
      <header className="panel-head">
        <p className="eyebrow">Clinic view</p>
        <h1>Pre-visit summary received</h1>
        <div className="received-meta">
          {decoded.createdAt && <span className="muted">Completed {decoded.createdAt.toLocaleString()}</span>}
          <span className={`pill ${decoded.fhirConsent ? '' : 'pill-grey'}`}>
            {decoded.fhirConsent ? 'Patient allowed record export' : 'View only: patient did not allow export'}
          </span>
        </div>
      </header>

      <div className="sheet">
        <ClinicianView summary={summary} />
      </div>

      <div className="action-row">
        <button
          className="btn btn-primary"
          disabled={!fhir}
          onClick={() => downloadJson(fhir, `previsit-questionnaire-response-${fhir.id.slice(0, 8)}.json`)}
          title={fhir ? 'Download as a FHIR R4 QuestionnaireResponse' : 'The patient did not allow export'}
        >
          Export to record (FHIR JSON)
        </button>
        {fhir && (
          <button className="btn btn-ghost" onClick={() => setShowJson((s) => !s)} aria-expanded={showJson}>
            {showJson ? 'Hide FHIR preview' : 'Preview FHIR'}
          </button>
        )}
        <button className="btn btn-ghost" onClick={onClear}>
          Scan another patient
        </button>
      </div>

      {!fhir && (
        <p className="muted export-note">
          Export is turned off because the patient chose view only. The summary disappears when this page is closed.
        </p>
      )}

      {showJson && fhir && <pre className="json">{JSON.stringify(fhir, null, 2)}</pre>}
    </section>
  )
}

export default function ClinicView({ code, onCode, onClear }) {
  if (code) return <Received code={code} onClear={onClear} />
  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Clinic view</p>
        <h1>Scan a patient's code</h1>
        <p className="lede">
          Patients make a code at the end of their pre-visit questionnaire. Scan it here to see their summary. In a
          real clinic, this screen would sit inside the check-in system.
        </p>
      </header>
      <Scanner onCode={onCode} />
    </section>
  )
}
