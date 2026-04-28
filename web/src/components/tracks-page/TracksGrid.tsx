import { motion } from 'framer-motion'
import TrackBrowseCard from './TrackBrowseCard'
import TracksEmptyState from './TracksEmptyState'
import type { Track } from '@/lib/types'

interface TrackWithProgress {
  track: Track
  percentage: number
  isComplete: boolean
}

interface TracksGridProps {
  tracks: TrackWithProgress[]
  totalCount: number
  hasFilters: boolean
  onClearFilters: () => void
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function TracksGrid({ tracks, totalCount, hasFilters, onClearFilters }: TracksGridProps) {
  return (
    <div>
      {tracks.length > 0 && (
        <p
          style={{
            margin: '0 0 14px',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.8125rem',
            color: 'var(--foreground)',
            opacity: 0.5,
          }}
        >
          Showing {tracks.length} of {totalCount}
        </p>
      )}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 20,
        }}
      >
        {tracks.length === 0 ? (
          <TracksEmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
        ) : (
          tracks.map(({ track, percentage, isComplete }) => (
            <motion.div key={track.id} variants={itemVariants}>
              <TrackBrowseCard track={track} percentage={percentage} isComplete={isComplete} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
