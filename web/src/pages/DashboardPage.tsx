import { motion, type Variants } from 'framer-motion'
import GreetingHero from '@/components/dashboard/GreetingHero'
import StreakCounter from '@/components/dashboard/StreakCounter'
import StatCard from '@/components/dashboard/StatCard'
import WeeklyHeatmap from '@/components/dashboard/WeeklyHeatmap'
import ContinueLearningSection from '@/components/dashboard/ContinueLearningSection'
import MiniLeaderboard from '@/components/dashboard/MiniLeaderboard'
import { useMockData } from '@/hooks/useMockData'
import { Zap, BookOpen, Award } from 'lucide-react'

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function DashboardPage() {
  const { state } = useMockData()
  const { stats } = state

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerVariants}
      style={{ paddingBottom: '2rem' }}
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <GreetingHero />
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StreakCounter />
        <StatCard icon={Zap} label="Atoms" value={stats.atomsCompleted} colorVar="--primary" />
        <StatCard icon={BookOpen} label="This week" value={stats.atomsThisWeek} colorVar="--secondary" />
        <StatCard icon={Award} label="Minutes" value={stats.totalMinutes} suffix="m" colorVar="--accent" />
      </motion.div>

      {/* Middle row: heatmap + leaderboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-6">
        <WeeklyHeatmap />
        <MiniLeaderboard />
      </motion.div>

      {/* Continue Learning */}
      <motion.div variants={itemVariants}>
        <ContinueLearningSection />
      </motion.div>
    </motion.div>
  )
}
