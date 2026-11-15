import { BASICS, COMFORT, TOPICS } from '../data/content.js'

const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]))
const comfortById = Object.fromEntries(COMFORT.map((c) => [c.id, c]))

/** Topics the patient has flagged (at least one detail or a note). */
export function selectedTopicIds(state) {
  return TOPICS.filter((t) => {
    const a = state.topics[t.id]
    return a && (a.details.length > 0 || a.note.trim())
  }).map((t) => t.id)
}

export const TOP_N = 3

/**
 * Full priority order of the topics the patient wants to discuss
 * ("just note it" topics are excluded). Saved order first, then any
 * newly flagged topics in their default order. The first TOP_N are top priorities.
 */
export function orderedRankable(state) {
  const rankable = selectedTopicIds(state).filter((id) => state.topics[id].comfort !== 'note')
  const saved = state.priorities.filter((id) => rankable.includes(id))
  return [...saved, ...rankable.filter((id) => !saved.includes(id))]
}

/** Flags (crisis / safety / today) triggered by the current answers. */
export function activeFlags(state) {
  const flags = new Set()
  for (const t of TOPICS) {
    const a = state.topics[t.id]
    if (!a) continue
    for (const d of t.details) if (d.flag && a.details.includes(d.id)) flags.add(d.flag)
  }
  return flags
}

function buildTopicItem(state, id) {
  const topic = topicById[id]
  const answer = state.topics[id]
  const chosen = topic.details.filter((d) => answer.details.includes(d.id))
  const comfort = comfortById[answer.comfort] || comfortById.self

  const starters = []
  if (comfort.id === 'ask') {
    starters.push(`This is hard for me to bring up, but could you ask me about ${topic.short.toLowerCase()}?`)
  }
  for (const d of chosen) starters.push(d.starter)

  return {
    id,
    title: topic.title,
    short: topic.short,
    details: chosen.map((d) => d.label),
    starters,
    comfort,
    note: answer.note.trim(),
    urgent: chosen.some((d) => d.flag === 'crisis' || d.flag === 'safety' || d.flag === 'today'),
  }
}

/**
 * Turns raw answers into an ordered visit plan.
 * Order: urgent items first, then the patient's top 3 in their chosen order,
 * then everything else they want to discuss, then "note only" items.
 */
export function buildSummary(state) {
  const ids = selectedTopicIds(state)
  const items = ids.map((id) => buildTopicItem(state, id))
  const prio = orderedRankable(state)

  const rank = (item) => {
    if (item.urgent) return -1
    const p = prio.indexOf(item.id)
    if (p >= 0) return p
    if (item.comfort.id === 'note') return 200
    return 100
  }
  items.sort((a, b) => rank(a) - rank(b))

  const discuss = items.filter((i) => i.urgent || i.comfort.id !== 'note')
  const noteOnly = items.filter((i) => !i.urgent && i.comfort.id === 'note')

  const b = state.basics
  const basics = BASICS.map((q) => {
    const v = b[q.id]
    const value = Array.isArray(v) ? v.join(', ') : (v || '').trim()
    return { id: q.id, label: q.label, value }
  }).filter((x) => x.value)

  const questions = (b.questions || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    discuss,
    noteOnly,
    basics,
    questions,
    prioritySet: new Set(prio.slice(0, TOP_N)),
    flags: activeFlags(state),
  }
}

/** Plain-text version of the clinician handoff, for copy/paste into a portal message. */
export function summaryToText(summary) {
  const lines = ['PRE-VISIT SUMMARY (patient-completed)', '']
  for (const x of summary.basics) {
    if (x.id === 'questions') continue
    lines.push(`${x.label}`, `  ${x.value.replace(/\n/g, '\n  ')}`)
  }
  if (summary.discuss.length) {
    lines.push('', 'TOPICS THE PATIENT WANTS TO DISCUSS (in priority order)')
    summary.discuss.forEach((i, n) => {
      lines.push(`${n + 1}. ${i.short}${i.urgent ? ' [raise early]' : ''}: ${i.comfort.summary}`)
      for (const d of i.details) lines.push(`   - ${d}`)
      if (i.note) lines.push(`   Patient note: "${i.note}"`)
    })
  }
  if (summary.noteOnly.length) {
    lines.push('', 'FOR AWARENESS ONLY (patient prefers not to discuss today)')
    for (const i of summary.noteOnly) {
      lines.push(`- ${i.short}: ${i.details.join('; ')}`)
      if (i.note) lines.push(`   Patient note: "${i.note}"`)
    }
  }
  if (summary.questions.length) {
    lines.push('', "PATIENT'S QUESTIONS")
    for (const q of summary.questions) lines.push(`- ${q}`)
  }
  return lines.join('\n')
}
