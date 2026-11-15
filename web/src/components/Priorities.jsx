import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { TOPICS } from '../data/content.js'
import { TOP_N, activeFlags, orderedRankable, selectedTopicIds } from '../lib/summary.js'

const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]))

function Tile({ id, index, count, details, onMove }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id })
  const topic = topicById[id]
  const top = index < TOP_N

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`tile ${top ? 'tile-top' : ''} ${isDragging ? 'tile-dragging' : ''}`}
    >
      <button
        ref={setActivatorNodeRef}
        className="tile-handle"
        aria-label={`Drag to reorder ${topic.short}. Currently position ${index + 1} of ${count}.`}
        {...attributes}
        {...listeners}
      >
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          {[5, 10, 15].map((y) =>
            [7, 13].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" />),
          )}
        </svg>
      </button>

      <span className="tile-rank" aria-hidden="true">
        {index + 1}
      </span>

      <span className="tile-text">
        <span className="tile-title">{topic.short}</span>
        <span className="tile-sub">
          {details} item{details === 1 ? '' : 's'}
        </span>
      </span>

      {top && <span className="pill tile-badge">Top priority</span>}

      <span className="tile-arrows">
        <button
          className="arrow"
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          aria-label={`Move ${topic.short} up`}
        >
          ↑
        </button>
        <button
          className="arrow"
          onClick={() => onMove(index, index + 1)}
          disabled={index === count - 1}
          aria-label={`Move ${topic.short} down`}
        >
          ↓
        </button>
      </span>
    </li>
  )
}

export default function Priorities({ state, onChange, onBack, onNext }) {
  const order = orderedRankable(state)
  const flags = activeFlags(state)
  const noteOnly = selectedTopicIds(state).filter((id) => state.topics[id].comfort === 'note')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const move = (from, to) => {
    if (to < 0 || to >= order.length) return
    onChange(arrayMove(order, from, to))
  }

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    move(order.indexOf(active.id), order.indexOf(over.id))
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Step 3 of 4</p>
        <h1>What matters most today?</h1>
        <p className="lede">
          Appointments go fast. Drag the tiles so the most important topics are at the top. Your top{' '}
          {Math.min(TOP_N, order.length) || TOP_N} get covered first, and everything else stays on your card.
        </p>
      </header>

      {flags.size > 0 && (
        <p className="callout">
          Something you selected is worth raising early in the visit, so it will be placed at the top of your card
          automatically.
        </p>
      )}

      {order.length === 0 ? (
        <div className="empty">
          <p>Nothing to rank yet. That's completely fine.</p>
          <p className="muted">You can go back and add some, or continue to your visit card.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <ol className="tiles">
              {order.map((id, i) => (
                <Tile
                  key={id}
                  id={id}
                  index={i}
                  count={order.length}
                  details={state.topics[id].details.length}
                  onMove={move}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      {noteOnly.length > 0 && (
        <p className="muted prio-foot">
          Also on your card for awareness only: {noteOnly.map((id) => topicById[id].short).join(', ')}.
        </p>
      )}

      <div className="nav-row">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          See my visit card →
        </button>
      </div>
    </section>
  )
}
