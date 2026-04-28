import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useTrackProgress } from '@/hooks/useTrackProgress'
import { useMockData } from '@/hooks/useMockData'
import ProgressBar from '@/components/common/ProgressBar'

interface AtomTopBarProps {
  trackId: string
  atomId: string
}

export default function AtomTopBar({ trackId, atomId }: AtomTopBarProps) {
  const navigate = useNavigate()
  const { state } = useMockData()
  const { percentage } = useTrackProgress(trackId)

  const track = state.tracks.find(t => t.id === trackId)
  const atom = state.atoms[atomId]

  // Find cell for breadcrumb
  const cellEntry = Object.entries(state.cells).find(([, cell]) =>
    cell.atomIds.includes(atomId)
  )
  const cellName = cellEntry ? cellEntry[1].title : ''

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 64,
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '0 1.5rem',
      backdropFilter: 'blur(12px)',
      background: 'color-mix(in srgb, var(--surface-bright) 80%, transparent)',
      borderBottom: '1px solid color-mix(in srgb, var(--foreground) 6%, transparent)',
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate(`/tracks/${trackId}`)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--foreground)', opacity: 0.7,
          fontFamily: "'Inter', sans-serif", fontSize: '0.85rem',
          padding: '4px 8px', borderRadius: '6px',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.55,
        overflow: 'hidden', flex: 1,
      }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track?.title ?? trackId}
        </span>
        <ChevronRight size={12} style={{ flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cellName}
        </span>
        <ChevronRight size={12} style={{ flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600, color: 'var(--foreground)', opacity: 1 }}>
          {atom?.title ?? atomId}
        </span>
      </div>

      {/* Track progress bar */}
      <div style={{ width: 120, flexShrink: 0 }}>
        <ProgressBar value={percentage} animated />
      </div>
    </div>
  )
}
