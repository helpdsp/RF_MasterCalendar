import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAtomNavigation } from '@/hooks/useAtomNavigation'
import CompletionButton from './CompletionButton'

interface AtomBottomBarProps {
  trackId: string
  atomId: string
  canComplete?: boolean
  score?: number
}

export default function AtomBottomBar({ trackId, atomId, canComplete = false, score }: AtomBottomBarProps) {
  const navigate = useNavigate()
  const { prevAtomId, nextAtomId, position, total } = useAtomNavigation(trackId, atomId)

  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      backdropFilter: 'blur(12px)',
      background: 'color-mix(in srgb, var(--surface-bright) 80%, transparent)',
      borderTop: '1px solid color-mix(in srgb, var(--foreground) 6%, transparent)',
      gap: '0.75rem',
    }}>
      {/* Prev */}
      <button
        onClick={() => prevAtomId && navigate(`/tracks/${trackId}/atoms/${prevAtomId}`)}
        disabled={!prevAtomId}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '6px 14px', borderRadius: '8px',
          background: 'var(--surface-container-low)',
          border: 'none', cursor: prevAtomId ? 'pointer' : 'not-allowed',
          color: 'var(--foreground)', opacity: prevAtomId ? 0.8 : 0.3,
          fontFamily: "'Inter', sans-serif", fontSize: '0.85rem',
        }}
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {/* Position + Completion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.45 }}>
          {position} / {total}
        </span>
        <CompletionButton atomId={atomId} canComplete={canComplete} score={score} />
      </div>

      {/* Next */}
      <button
        onClick={() => nextAtomId && navigate(`/tracks/${trackId}/atoms/${nextAtomId}`)}
        disabled={!nextAtomId}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '6px 14px', borderRadius: '8px',
          background: nextAtomId ? 'linear-gradient(135deg, var(--primary), var(--primary-dim))' : 'var(--surface-container-low)',
          border: 'none', cursor: nextAtomId ? 'pointer' : 'not-allowed',
          color: nextAtomId ? '#fff' : 'var(--foreground)',
          opacity: nextAtomId ? 1 : 0.3,
          fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600,
        }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  )
}
