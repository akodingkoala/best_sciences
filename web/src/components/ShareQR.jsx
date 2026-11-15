import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { MAX_QR_CHARS, clinicUrl, encodeState } from '../lib/share.js'

export default function ShareQR({ state, consent, onConsent }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = useMemo(() => clinicUrl(encodeState(state, { fhirConsent: consent })), [state, consent])
  const tooBig = url.length > MAX_QR_CHARS

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <section className="share no-print" aria-labelledby="share-title">
      <div className="share-text">
        <h2 id="share-title">Share with your clinic</h2>
        <p className="muted">
          Show a QR code at check-in. Staff scan it and see the clinician summary. Nothing is uploaded: your answers
          travel inside the code itself.
        </p>

        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} />
          <span className="switch" aria-hidden="true" />
          <span>
            <strong>Let the clinic save this to my health record</strong>
            <span className="consent-sub">
              Allows staff to export it in FHIR format, the standard health-record systems use. If this is off, staff
              can view your summary but can't save it.
            </span>
          </span>
        </label>

        <div className="share-actions">
          <button className="btn btn-primary" onClick={() => setShow((s) => !s)} aria-expanded={show}>
            {show ? 'Hide QR code' : 'Show QR code'}
          </button>
          <button className="btn btn-ghost" onClick={copy}>
            {copied ? 'Link copied ✓' : 'Copy clinic link'}
          </button>
        </div>
      </div>

      {show && (
        <div className="qr-wrap">
          {tooBig ? (
            <p className="callout">
              Your answers are too long to fit in one QR code. Shorten your notes, or use "Copy clinic link" and
              send it through your patient portal.
            </p>
          ) : (
            <>
              <div className="qr-box">
                <QRCodeSVG value={url} size={280} level="L" marginSize={4} title="QR code for clinic check-in" />
              </div>
              <p className="qr-caption">
                Show this to clinic staff only. It contains your answers.
                <br />
                <span className={`pill ${consent ? '' : 'pill-grey'}`}>
                  {consent ? 'Record export allowed' : 'View only, no export'}
                </span>
              </p>
            </>
          )}
        </div>
      )}
    </section>
  )
}
