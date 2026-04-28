import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useMockData } from '@/hooks/useMockData'
import GlassCard from '@/components/common/GlassCard'
import AnimatedCounter from '@/components/common/AnimatedCounter'

export default function StreakCounter() {
  const { state } = useMockData()
  const { streak } = state

  return (
    <GlassCard hover style={{ padding: '1.5rem', textAlign: 'center' }}>
      {/* Animated flame icon */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'inline-block', marginBottom: '0.5rem' }}
      >
        <Flame size={40} style={{ color: '#ff6b35' }} />
      </motion.div>

      {/* Big streak number */}
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '3rem',
        fontWeight: 800,
        color: 'var(--primary)',
        lineHeight: 1,
        marginBottom: '0.25rem',
      }}>
        <AnimatedCounter value={streak.currentStreak} />
      </div>

      <div style={{ fontSize: '0.875rem', color: 'var(--foreground)', opacity: 0.7 }}>
        Day streak
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.5, marginTop: '0.25rem' }}>
        Best: {streak.maxStreak} days
      </div>
    </GlassCard>
  )
}
