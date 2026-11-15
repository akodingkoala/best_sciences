// Packs the patient's answers into a compact string that fits in a QR code.
// The data goes in the URL *fragment* (#/clinic?d=...), which browsers never
// send to a server, so there is still no backend and no upload.
import LZString from 'lz-string'
import { BASICS, COMFORT, TOPICS } from '../data/content.js'

const VERSION = 2
// Practical limit for a QR a phone can read off a screen.
export const MAX_QR_CHARS = 1400

const COMFORT_IDS = COMFORT.map((c) => c.id)

// Compact positional format (keeps the QR small enough to scan off a phone):
// [version, createdSeconds, fhirConsent, basics[], topics[], priorities[]]
//   basics[i]  : text questions -> string; single choice -> option index + 1; multi -> [indices]; 0 = empty
//   topics[i]  : 0 = nothing, else [detailBitmask, comfortIndex, note?]
//   priorities : topic indices in the patient's order
export function encodeState(state, { fhirConsent }) {
  const basics = BASICS.map((q) => {
    const v = state.basics[q.id]
    if (q.type === 'single') return v ? q.options.indexOf(v) + 1 : 0
    if (q.type === 'multi') return (v || []).map((o) => q.options.indexOf(o)).filter((i) => i >= 0)
    return v && String(v).trim() ? String(v).trim() : 0
  })
  const topics = TOPICS.map((t) => {
    const a = state.topics[t.id]
    if (!a || (!a.details.length && !a.note.trim())) return 0
    const mask = t.details.reduce((m, d, i) => (a.details.includes(d.id) ? m | (1 << i) : m), 0)
    const entry = [mask, Math.max(0, COMFORT_IDS.indexOf(a.comfort))]
    if (a.note.trim()) entry.push(a.note.trim())
    return entry
  })
  while (topics.length && topics[topics.length - 1] === 0) topics.pop()
  const prio = state.priorities.map((id) => TOPICS.findIndex((t) => t.id === id)).filter((i) => i >= 0)
  const payload = [VERSION, Math.floor(Date.now() / 1000), fhirConsent ? 1 : 0, basics, topics, prio]
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload))
}

export function clinicUrl(encoded) {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#/clinic?d=${encoded}`
}

/** Pulls the `d=` value out of a scanned URL, a pasted link, or a bare code. */
export function extractCode(text) {
  const t = (text || '').trim()
  const m = t.match(/[?&#]d=([A-Za-z0-9+\-$_]+)/)
  if (m) return m[1]
  if (/^[A-Za-z0-9+\-$_]+$/.test(t)) return t
  return null
}

const str = (v, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '')

/**
 * Decodes and validates a scanned code. QR contents are untrusted input:
 * only known question/topic/detail ids and capped-length strings are kept.
 * Returns { state, createdAt, fhirConsent } or throws.
 */
export function decodeCode(code) {
  const json = LZString.decompressFromEncodedURIComponent(code)
  if (!json) throw new Error('This code could not be read.')
  let raw
  try {
    raw = JSON.parse(json)
  } catch {
    throw new Error('This code could not be read.')
  }
  if (!Array.isArray(raw) || raw[0] !== VERSION) throw new Error('This code is from an unsupported version.')
  const [, created, consent, rawBasics, rawTopics, rawPrio] = raw

  const basics = { goals: [] }
  BASICS.forEach((q, i) => {
    const v = Array.isArray(rawBasics) ? rawBasics[i] : 0
    if (q.type === 'single') {
      if (Number.isInteger(v) && q.options[v - 1]) basics[q.id] = q.options[v - 1]
    } else if (q.type === 'multi') {
      basics[q.id] = (Array.isArray(v) ? v : []).map((n) => q.options[n]).filter(Boolean)
    } else if (typeof v === 'string') {
      basics[q.id] = str(v)
    }
  })

  const topics = {}
  TOPICS.forEach((t, i) => {
    const entry = Array.isArray(rawTopics) ? rawTopics[i] : 0
    if (!Array.isArray(entry)) return
    const [mask, comfortIdx, note] = entry
    const m = Number.isInteger(mask) ? mask : 0
    topics[t.id] = {
      details: t.details.filter((_, j) => m & (1 << j)).map((d) => d.id),
      comfort: COMFORT_IDS[comfortIdx] || 'self',
      note: str(note, 1000),
    }
  })

  const priorities = (Array.isArray(rawPrio) ? rawPrio : [])
    .map((n) => TOPICS[n]?.id)
    .filter((id) => id && topics[id])
  const createdAt = Number.isFinite(created) ? new Date(created * 1000) : null

  return { state: { basics, topics, priorities }, createdAt, fhirConsent: consent === 1 }
}
