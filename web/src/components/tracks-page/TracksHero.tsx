import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/common/AnimatedCounter'

interface TracksHeroProps {
  totalTracks: number
  totalAtoms: number
  inProgressCount: number
}

export default function TracksHero({ totalTracks, totalAtoms, inProgressCount }: TracksHeroProps) {
  const headline = inProgressCount > 0
    ? 'Continue Your Journey'
    : 'Explore Tracks'

  const stats = [
    { label: 'Tracks', value: totalTracks },
    { label: 'Atoms Total', value: totalAtoms },
    { label: 'In Progress', value: inProgressCount },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(var(--primary-rgb,99,102,241),0.12), rgba(var(--secondary-rgb,139,92,246),0.08))',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 28px',
        marginBottom: 24,
        position: 'relative',
      }}
    >
      {/* Subtle gradient orb */}
      <div
        style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <h1
        style={{
          margin: '0 0 20px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: 'var(--foreground)',
          letterSpacing: '-0.02em',
        }}
      >
        {headline}
      </h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {stats.map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              backgroundColor: 'var(--surface-bright)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--primary)',
              }}
            >
              <AnimatedCounter value={value} />
            </span>
            <span
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.8125rem',
                color: 'var(--foreground)',
                opacity: 0.7,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
