import { useMemo } from 'react'
import { useMockData } from '@/hooks/useMockData'
import type { Track } from '@/lib/types'
import type { StatusFilter, LangFilter } from '@/components/tracks-page/FilterChips'

export interface FilterOptions {
  search: string
  status: StatusFilter
  language: LangFilter
}

export interface TrackProgressMap {
  [trackId: string]: { percentage: number; isComplete: boolean }
}

export function useTracksFilter(
  tracks: Track[],
  progressMap: TrackProgressMap,
  options: FilterOptions,
) {
  const { state } = useMockData()
  void state // ensure reactivity on progress changes

  return useMemo(() => {
    return tracks.filter((track) => {
      const { percentage, isComplete } = progressMap[track.id] ?? { percentage: 0, isComplete: false }

      // 1. Search: title + description
      if (options.search.trim()) {
        const q = options.search.toLowerCase()
        const titleMatch = track.title.toLowerCase().includes(q)
        const descMatch = track.description.toLowerCase().includes(q)
        if (!titleMatch && !descMatch) return false
      }

      // 2. Status filter
      if (options.status !== 'all') {
        if (options.status === 'completed' && !isComplete) return false
        if (options.status === 'in_progress' && (percentage === 0 || isComplete)) return false
        if (options.status === 'not_started' && percentage > 0) return false
      }

      // 3. Language filter
      if (options.language !== 'all' && track.language !== options.language) return false

      return true
    })
  }, [tracks, progressMap, options.search, options.status, options.language])
}
