import { useNavigate } from 'react-router-dom'
import { useMockData } from '@/hooks/useMockData'
import { CheckCircle2, Circle, Lock, Play, HelpCircle, BookOpen, CreditCard, ClipboardList } from 'lucide-react'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <Play size={14} />,
  quiz: <HelpCircle size={14} />,
  flashcard: <CreditCard size={14} />,
  playbook: <BookOpen size={14} />,
  task: <ClipboardList size={14} />,
}

interface AtomListItemProps {
  atomId: string
  trackId: string
  isLast?: boolean
}

export default function AtomListItem({ atomId, trackId, isLast = false }: AtomListItemProps) {
  const navigate = useNavigate()
  const { state } = useMockData()
  const atom = state.atoms[atomId]
  const progress = state.progress[atomId]

  if (!atom) return null

  const status = progress?.status ?? 'not_started'
  const isCompleted = status === 'completed'
  const isInProgress = status === 'in_progress'

  return (
    <button
      onClick={() => navigate(`/tracks/${trackId}/atoms/${atomId}`)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.625rem 1rem',
        background: 'transparent', border: 'none', cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid color-mix(in srgb, var(--foreground) 6%, transparent)',
        transition: 'background 150ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 6%, transparent)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Status icon */}
      <div style={{ flexShrink: 0, color: isCompleted ? 'var(--success, #69f6b8)' : isInProgress ? 'var(--warning, #ffd166)' : 'var(--foreground)', opacity: isCompleted || isInProgress ? 1 : 0.35 }}>
        {isCompleted ? <CheckCircle2 size={18} /> : isInProgress ? <Circle size={18} /> : <Lock size={18} />}
      </div>

      {/* Type icon */}
      <div style={{ flexShrink: 0, color: 'var(--primary)', opacity: 0.7 }}>
        {TYPE_ICONS[atom.type] ?? <Circle size={14} />}
      </div>

      {/* Title */}
      <span style={{
        flex: 1, textAlign: 'left',
        fontSize: '0.875rem', fontWeight: isInProgress ? 600 : 400,
        color: 'var(--foreground)', opacity: status === 'not_started' ? 0.6 : 1,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{atom.title}</span>

      {/* Duration */}
      <span style={{ fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.4, flexShrink: 0 }}>
        {atom.estimatedMinutes}m
      </span>
    </button>
  )
}
