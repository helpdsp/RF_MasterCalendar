import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, ArrowRight, Home } from 'lucide-react'
import { toast } from 'sonner'
import { useMockData } from '@/hooks/useMockData'
import type { Track } from '@/lib/types'

interface TrackCompletionModalProps {
  track: Track
  isOpen: boolean
  onClose: () => void
}

export default function TrackCompletionModal({ track, isOpen, onClose }: TrackCompletionModalProps) {
  const navigate = useNavigate()
  const { state } = useMockData()

  useEffect(() => {
    if (!isOpen) return
    // Dual confetti burst
    import('canvas-confetti').then(m => {
      const confetti = m.default
      confetti({ origin: { x: 0.2, y: 0.6 }, particleCount: 80, spread: 60, colors: ['#a3a6ff', '#69f6b8', '#ac8aff'] })
      setTimeout(() => {
        confetti({ origin: { x: 0.8, y: 0.6 }, particleCount: 80, spread: 60, colors: ['#a3a6ff', '#69f6b8', '#ac8aff'] })
      }, 200)
    })
  }, [isOpen])

  function handleShare() {
    navigator.clipboard.writeText('https://fasttrack.ai/cert/demo-xyz')
      .then(() => toast.success('Certificate link copied!'))
      .catch(() => toast.error('Could not copy link'))
  }

  const today = new Date().toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(12px)',
            background: 'rgba(0,0,0,0.6)',
          }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              width: '100%', maxWidth: 480,
              background: 'var(--surface-bright)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--foreground)', opacity: 0.5, padding: 4,
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)',
                marginBottom: '0.375rem',
              }}>Track Complete!</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', opacity: 0.6 }}>
                You've completed all atoms in this track.
              </p>
            </div>

            {/* Certificate card */}
            <div style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), color-mix(in srgb, var(--secondary) 8%, transparent))',
              border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.375rem' }}>
                Certificate of Completion
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                {state.user.displayName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.65 }}>{track.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.4, marginTop: '0.5rem' }}>{today}</div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.625rem', borderRadius: 'var(--radius)',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
                  border: 'none', cursor: 'pointer',
                  color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600,
                }}
              >
                <Share2 size={16} /> Share Certificate
              </button>
              <button
                onClick={() => { onClose(); navigate('/dashboard') }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.625rem', borderRadius: 'var(--radius)',
                  background: 'var(--surface-container-low)',
                  border: 'none', cursor: 'pointer',
                  color: 'var(--foreground)', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem',
                }}
              >
                <Home size={16} /> Go to Dashboard
              </button>
              <button
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.625rem', borderRadius: 'var(--radius)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--foreground)', opacity: 0.5, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem',
                }}
              >
                <ArrowRight size={16} /> Keep Exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
