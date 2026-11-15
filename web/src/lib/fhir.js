// Builds an HL7 FHIR R4 QuestionnaireResponse from the patient's answers.
// Spec: https://hl7.org/fhir/R4/questionnaireresponse.html
//
// Prototype notes:
// - The canonical URLs below use example.org. A real deployment would publish a
//   matching Questionnaire resource and code system at a real URL.
// - No patient identity is collected, so there is no `subject`. The receiving
//   system attaches the response to the right chart when staff import it.
import { BASICS, COMFORT, TOPICS } from '../data/content.js'
import { TOP_N, orderedRankable } from './summary.js'

const BASE = 'http://example.org/fhir/before-you-go'
export const QUESTIONNAIRE_URL = `${BASE}/Questionnaire/previsit|0.1.0`
const DETAIL_SYSTEM = `${BASE}/CodeSystem/topic-detail`
const COMFORT_SYSTEM = `${BASE}/CodeSystem/discussion-preference`

const comfortById = Object.fromEntries(COMFORT.map((c) => [c.id, c]))

function newId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `byg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function basicsGroup(basics) {
  const items = []
  for (const q of BASICS) {
    const v = basics[q.id]
    let answers = []
    if (Array.isArray(v)) answers = v.filter(Boolean).map((s) => ({ valueString: s }))
    else if (q.id === 'questions' && v) {
      answers = v
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ valueString: s }))
    } else if (v && String(v).trim()) answers = [{ valueString: String(v).trim() }]
    if (answers.length) items.push({ linkId: `basics.${q.id}`, text: q.label, answer: answers })
  }
  return items.length ? { linkId: 'basics', text: 'The basics', item: items } : null
}

function topicsGroup(state) {
  const order = orderedRankable(state)
  const items = []
  for (const t of TOPICS) {
    const a = state.topics[t.id]
    if (!a || (!a.details.length && !a.note.trim())) continue
    const chosen = t.details.filter((d) => a.details.includes(d.id))
    const comfort = comfortById[a.comfort] || comfortById.self
    const sub = []
    if (chosen.length) {
      sub.push({
        linkId: `topic.${t.id}.details`,
        text: 'What applies',
        answer: chosen.map((d) => ({ valueCoding: { system: DETAIL_SYSTEM, code: `${t.id}.${d.id}`, display: d.label } })),
      })
    }
    sub.push({
      linkId: `topic.${t.id}.preference`,
      text: 'How the patient would like this handled',
      answer: [{ valueCoding: { system: COMFORT_SYSTEM, code: comfort.id, display: comfort.summary } }],
    })
    const rank = order.indexOf(t.id)
    if (rank >= 0) {
      sub.push({ linkId: `topic.${t.id}.rank`, text: 'Patient priority rank (1 = most important)', answer: [{ valueInteger: rank + 1 }] })
      sub.push({ linkId: `topic.${t.id}.top`, text: `In patient's top ${TOP_N}`, answer: [{ valueBoolean: rank < TOP_N }] })
    }
    const early = chosen.some((d) => d.flag)
    if (early) sub.push({ linkId: `topic.${t.id}.raise-early`, text: 'Patient selected an item worth raising early', answer: [{ valueBoolean: true }] })
    if (a.note.trim()) sub.push({ linkId: `topic.${t.id}.note`, text: "Patient's own words", answer: [{ valueString: a.note.trim() }] })

    items.push({ linkId: `topic.${t.id}`, text: t.title, item: sub })
  }
  return items.length ? { linkId: 'topics', text: 'Topics the patient flagged', item: items } : null
}

export function toQuestionnaireResponse(state, authored = new Date()) {
  return {
    resourceType: 'QuestionnaireResponse',
    id: newId(),
    questionnaire: QUESTIONNAIRE_URL,
    status: 'completed',
    authored: authored.toISOString(),
    item: [basicsGroup(state.basics), topicsGroup(state)].filter(Boolean),
  }
}

export function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/fhir+json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
