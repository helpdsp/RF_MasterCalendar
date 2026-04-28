import { useNavigate } from 'react-router-dom'
import GlassCard from '@/components/common/GlassCard'
import ProgressBar from '@/components/common/ProgressBar'
import { useTrackProgress } from '@/hooks/useTrackProgress'
import type { Track } from '@/lib/types'

interface TrackCardProps { track: Track }

export default function TrackCard({ track }: TrackCardProps) {
  const navigate = useNavigate()
  const { percentage, completedCount, totalCount } = useTrackProgress(track.id)

  return (
    <GlassCard hover style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/tracks/${track.id}`)}>
      {/* Thumbnail area */}
      <div style={{
        height: 120,
        background: `linear-gradient(135deg, var(--primary-dim), var(--secondary))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: '2rem' }}>📚</span>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 20, padding: '2px 8px',
          fontSize: '0.7rem', color: '#fff',
        }}>
          {track.language.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.95rem', fontWeight: 700,
          color: 'var(--foreground)', marginBottom: '0.25rem',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{track.title}</h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.6, marginBottom: '0.75rem' }}>
          {completedCount}/{totalCount} atoms
        </p>

        <ProgressBar value={percentage} animated />

        <button
          style={{
            marginTop: '0.75rem',
            width: '100%',
            padding: '0.5rem',
            borderRadius: 'var(--radius)',
            border: 'none',
            background: percentage === 100 ? 'var(--surface-container-high)' : 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
            color: percentage === 100 ? 'var(--foreground)' : '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={(e) => { e.stopPropagation(); navigate(`/tracks/${track.id}`) }}
        >
          {percentage === 0 ? 'Start' : percentage === 100 ? 'Completed ✓' : `Continue ${Math.round(percentage)}%`}
        </button>
      </div>
    </GlassCard>
  )
}
