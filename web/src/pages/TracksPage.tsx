import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMockData } from '@/hooks/useMockData'
import { useTrackProgress } from '@/hooks/useTrackProgress'
import { useTracksFilter } from '@/hooks/useTracksFilter'
import type { StatusFilter, LangFilter } from '@/components/tracks-page/FilterChips'
import TracksHero from '@/components/tracks-page/TracksHero'
import TracksSearchBar from '@/components/tracks-page/TracksSearchBar'
import FilterChips from '@/components/tracks-page/FilterChips'
import TracksGrid from '@/components/tracks-page/TracksGrid'

// Sub-component to get progress per track (hook must be called at component level)
function useAllTrackProgress(trackIds: string[]) {
  const p0 = useTrackProgress(trackIds[0] ?? '')
  const p1 = useTrackProgress(trackIds[1] ?? '')
  const p2 = useTrackProgress(trackIds[2] ?? '')
  const p3 = useTrackProgress(trackIds[3] ?? '')
  const p4 = useTrackProgress(trackIds[4] ?? '')
  const p5 = useTrackProgress(trackIds[5] ?? '')
  const p6 = useTrackProgress(trackIds[6] ?? '')
  const p7 = useTrackProgress(trackIds[7] ?? '')
  const p8 = useTrackProgress(trackIds[8] ?? '')
  const p9 = useTrackProgress(trackIds[9] ?? '')

  const allResults = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9]

  return useMemo(() => {
    const map: Record<string, { percentage: number; isComplete: boolean }> = {}
    trackIds.forEach((id, i) => {
      if (id) map[id] = { percentage: allResults[i].percentage, isComplete: allResults[i].isComplete }
    })
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIds, p0.percentage, p1.percentage, p2.percentage, p3.percentage, p4.percentage,
    p5.percentage, p6.percentage, p7.percentage, p8.percentage, p9.percentage])
}

export default function TracksPage() {
  const { state } = useMockData()
  const tracks = state.tracks

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [langFilter, setLangFilter] = useState<LangFilter>('all')

  const trackIds = useMemo(() => tracks.map((t) => t.id), [tracks])
  const progressMap = useAllTrackProgress(trackIds)

  // Hero stats
  const totalAtoms = useMemo(() => tracks.reduce((sum, t) => sum + t.totalAtoms, 0), [tracks])
  const inProgressCount = useMemo(() =>
    tracks.filter((t) => {
      const { percentage, isComplete } = progressMap[t.id] ?? { percentage: 0, isComplete: false }
      return percentage > 0 && !isComplete
    }).length,
    [tracks, progressMap],
  )

  const filteredTracks = useTracksFilter(tracks, progressMap, {
    search,
    status: statusFilter,
    language: langFilter,
  })

  const tracksWithProgress = filteredTracks.map((t) => ({
    track: t,
    ...(progressMap[t.id] ?? { percentage: 0, isComplete: false }),
  }))

  const hasFilters = search !== '' || statusFilter !== 'all' || langFilter !== 'all'

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setLangFilter('all')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <TracksHero
        totalTracks={tracks.length}
        totalAtoms={totalAtoms}
        inProgressCount={inProgressCount}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <TracksSearchBar value={search} onChange={setSearch} />
        <FilterChips
          statusFilter={statusFilter}
          langFilter={langFilter}
          onStatusChange={setStatusFilter}
          onLangChange={setLangFilter}
        />
      </div>

      <TracksGrid
        tracks={tracksWithProgress}
        totalCount={tracks.length}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
      />
    </motion.div>
  )
}
