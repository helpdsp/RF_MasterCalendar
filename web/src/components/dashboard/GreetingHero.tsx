import { motion } from 'framer-motion'
import { useMockData } from '@/hooks/useMockData'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function GreetingHero() {
  const { state } = useMockData()
  const { user, streak } = state

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ marginBottom: '2rem' }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--foreground)',
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}
      >
        {getGreeting()}, {user.displayName.split(' ')[0]}! 👋
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem',
          color: 'var(--foreground)',
          opacity: 0.7,
        }}
      >
        🔥 {streak.currentStreak}-day streak — keep it going!
      </motion.p>
    </motion.div>
  )
}
