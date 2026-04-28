import { useNavigate } from 'react-router-dom'
import { useTrackProgress } from '@/hooks/useTrackProgress'
import { useMockData } from '@/hooks/useMockData'
import ProgressBar from '@/components/common/ProgressBar'
import type { Track } from '@/lib/types'

interface TrackHeaderProps { track: Track }

export default function TrackHeader({ track }: TrackHeaderProps) {
  const navigate = useNavigate()
  const { state } = useMockData()
  const { percentage, completedCount, totalCount } = useTrackProgress(track.id)

  // CTA logic: find first incomplete atom
  function getFirstIncompleteAtomId(): string | null {
    for (const cellId of track.cellIds) {
      const cell = state.cells[cellId]
      if (!cell) continue
      for (const atomId of cell.atomIds) {
        if (state.progress[atomId]?.status !== 'completed') return atomId
      }
    }
    return null
  }

  const firstIncompleteId = getFirstIncompleteAtomId()

  function handleCTA() {
    if (firstIncompleteId) navigate(`/tracks/${track.id}/atoms/${firstIncompleteId}`)
  }

  const ctaLabel = percentage === 0 ? 'Start Track' :
                   percentage === 100 ? 'Completed ✓' :
                   `Continue — ${Math.round(percentage)}%`

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Title */}
      <h1 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        fontWeight: 800,
        color: 'var(--foreground)',
        marginBottom: '0.5rem',
        lineHeight: 1.2,
      }}>{track.title}</h1>

      {/* Description */}
      <p style={{ fontSize: '1rem', color: 'var(--foreground)', opacity: 0.7, marginBottom: '1rem', maxWidth: '600px' }}>
        {track.description}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={track.creatorAvatarUrl} alt="" width={24} height={24} style={{ borderRadius: '50%' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--foreground)', opacity: 0.65 }}>{track.creatorName}</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--foreground)', opacity: 0.65 }}>
          {totalCount} atoms · ~{Math.round(track.estimatedMinutes / 60 * 10) / 10}h · {track.completions.toLocaleString()} completions
        </span>
        <span style={{
          fontSize: '0.75rem', padding: '2px 8px',
          borderRadius: '999px',
          background: 'color-mix(in srgb, var(--primary) 15%, transparent)',
          color: 'var(--primary)',
        }}>{track.language.toUpperCase()}</span>
      </div>

      {/* Progress */}
      <div style={{ maxWidth: 400, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.6 }}>Progress</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>{completedCount}/{totalCount}</span>
        </div>
        <ProgressBar value={percentage} animated />
      </div>

      {/* CTA Button */}
      <button
        disabled={percentage === 100}
        onClick={handleCTA}
        style={{
          padding: '0.625rem 1.5rem',
          borderRadius: 'var(--radius)',
          border: 'none',
          background: percentage === 100 ? 'var(--surface-container-high)' : 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          color: percentage === 100 ? 'var(--foreground)' : '#fff',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: percentage === 100 ? 'default' : 'pointer',
          opacity: percentage === 100 ? 0.8 : 1,
        }}
      >
        {ctaLabel}
      </button>
    </div>
  )
}
