import { motion } from 'framer-motion'

interface TracksEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export default function TracksEmptyState({ hasFilters, onClearFilters }: TracksEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gridColumn: '1 / -1',
      }}
    >
      {/* SVG illustration */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        style={{ marginBottom: 24, opacity: 0.4 }}
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
        <path
          d="M26 32h28M26 40h20M26 48h14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="56" cy="56" r="12" fill="var(--surface-bright)" stroke="currentColor" strokeWidth="2" />
        <path
          d="M53 53l6 6M59 53l-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <h3
        style={{
          margin: '0 0 8px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '1.125rem',
          color: 'var(--foreground)',
        }}
      >
        {hasFilters ? 'No tracks match your filters' : 'No tracks available'}
      </h3>
      <p
        style={{
          margin: '0 0 20px',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          color: 'var(--foreground)',
          opacity: 0.5,
          maxWidth: 300,
          lineHeight: 1.5,
        }}
      >
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'Check back soon for new learning tracks.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          style={{
            padding: '8px 20px',
            borderRadius: 20,
            border: '1px solid var(--primary)',
            background: 'transparent',
            color: 'var(--primary)',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Clear filters
        </button>
      )}
    </motion.div>
  )
}
