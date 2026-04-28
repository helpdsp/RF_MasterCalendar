import { useMockData } from '@/hooks/useMockData'

export interface UseTrackProgressReturn {
  completedCount: number
  totalCount: number
  percentage: number
  isComplete: boolean
}

/**
 * Calculates progress for a given track by aggregating atom completion
 * across all cells belonging to that track.
 *
 * @param trackId - The ID of the track to evaluate.
 */
export function useTrackProgress(trackId: string): UseTrackProgressReturn {
  const { state } = useMockData()

  const track = state.tracks.find((t) => t.id === trackId)

  if (!track) {
    return { completedCount: 0, totalCount: 0, percentage: 0, isComplete: false }
  }

  // Collect all atom IDs from every cell in the track
  const atomIds = track.cellIds.flatMap((cellId) => {
    const cell = state.cells[cellId]
    return cell ? cell.atomIds : []
  })

  const totalCount = atomIds.length
  const completedCount = atomIds.filter(
    (atomId) => state.progress[atomId]?.status === 'completed',
  ).length

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isComplete = totalCount > 0 && completedCount === totalCount

  return { completedCount, totalCount, percentage, isComplete }
}
