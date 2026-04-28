import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Layers } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import type { Track } from '@/lib/types'

const LANG_GRADIENTS: Record<string, string> = {
  en: 'linear-gradient(135deg, #1a1a4e, #2d1b69)',
  es: 'linear-gradient(135deg, #1a3040, #0d4a3a)',
}

const LANG_LABEL: Record<string, string> = { en: 'EN', es: 'ES' }

interface TrackBrowseCardProps {
  track: Track
  percentage: number
  isComplete: boolean
}

export default function TrackBrowseCard({ track, percentage, isComplete }: TrackBrowseCardProps) {
  const navigate = useNavigate()

  function getCTA() {
    if (isComplete) return 'Completed ✓'
    if (percentage > 0) return `Continue ${percentage}%`
    return 'Start'
  }

  function getCTAStyle(): React.CSSProperties {
    if (isComplete) {
      return {
        background: 'linear-gradient(135deg, var(--success, #22c55e), #16a34a)',
        color: '#fff',
      }
    }
    if (percentage > 0) {
      return {
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
        color: '#fff',
      }
    }
    return {
      background: 'var(--surface-container-high)',
      color: 'var(--primary)',
    }
  }

  const estimatedHours = track.estimatedMinutes >= 60
    ? `${Math.round(track.estimatedMinutes / 60)}h`
    : `${track.estimatedMinutes}m`

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/tracks/${track.id}`)}
      style={{
        cursor: 'pointer',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-bright)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 180,
          background: LANG_GRADIENTS[track.language] ?? LANG_GRADIENTS.en,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {track.thumbnailUrl && (
          <img
            src={track.thumbnailUrl}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.3,
            }}
          />
        )}
        {/* Language badge */}
        <span
          style={{
            position: 'absolute', top: 12, right: 12,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {LANG_LABEL[track.language]}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Title */}
        <h3
          style={{
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--foreground)',
            lineHeight: 1.3,
          }}
        >
          {track.title}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.8125rem',
            color: 'var(--foreground)',
            opacity: 0.6,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {track.description}
        </p>

        {/* Creator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src={track.creatorAvatarUrl}
            alt={track.creatorName}
            style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--surface-container-high)' }}
          />
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.8125rem',
              color: 'var(--foreground)',
              opacity: 0.7,
            }}
          >
            {track.creatorName}
          </span>
        </div>

        {/* Progress */}
        {percentage > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.5 }}>
                Progress
              </span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                {percentage}%
              </span>
            </div>
            <ProgressBar value={percentage} animated />
          </div>
        )}

        {/* Stats + CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter',sans-serif", fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.5 }}>
            <Layers size={12} />
            {track.totalAtoms} atoms
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter',sans-serif", fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.5 }}>
            <Clock size={12} />
            {estimatedHours}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/tracks/${track.id}`) }}
            style={{
              marginLeft: 'auto',
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.8125rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'opacity 0.15s',
              ...getCTAStyle(),
            }}
          >
            {getCTA()}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
