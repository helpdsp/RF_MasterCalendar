import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, Navigate } from 'react-router-dom'
import { useMockData } from '@/hooks/useMockData'
import TrackHeader from '@/components/track/TrackHeader'
import NodeGraphCanvas from '@/components/track/NodeGraphCanvas'
import TrackListView from '@/components/track/TrackListView'
import ViewToggle from '@/components/track/ViewToggle'

export default function TrackOverviewPage() {
  const { trackId } = useParams<{ trackId: string }>()
  const { state } = useMockData()

  // Default: graph on desktop, list on mobile
  const [view, setView] = useState<'graph' | 'list'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      return 'list'
    }
    return 'graph'
  })

  // Force list on mobile when resizing
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setView('list')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const track = state.tracks.find(t => t.id === trackId)
  if (!track) return <Navigate to="/dashboard" replace />

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <TrackHeader track={track} />

      {/* View toggle + content */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {view === 'graph'
          ? <NodeGraphCanvas track={track} />
          : <TrackListView track={track} />
        }
      </motion.div>
    </motion.div>
  )
}
