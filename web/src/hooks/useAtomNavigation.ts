import { useMockData } from '@/hooks/useMockData'

export interface UseAtomNavigationReturn {
  prevAtomId: string | null
  nextAtomId: string | null
  /** 1-based position of the current atom within the track. 0 if not found. */
  position: number
  /** Total number of atoms in the track. */
  total: number
}

/**
 * Provides linear navigation context for an atom within a track.
 * Atoms are ordered by cell order and then by their position within each cell.
 *
 * @param trackId      - The ID of the track.
 * @param currentAtomId - The ID of the currently active atom.
 */
export function useAtomNavigation(
  trackId: string,
  currentAtomId: string,
): UseAtomNavigationReturn {
  const { state } = useMockData()

  const track = state.tracks.find((t) => t.id === trackId)

  if (!track) {
    return { prevAtomId: null, nextAtomId: null, position: 0, total: 0 }
  }

  // Build the flat ordered list of atom IDs for this track
  const orderedAtomIds = track.cellIds.flatMap((cellId) => {
    const cell = state.cells[cellId]
    return cell ? cell.atomIds : []
  })

  const total = orderedAtomIds.length
  const index = orderedAtomIds.indexOf(currentAtomId)

  if (index === -1) {
    return { prevAtomId: null, nextAtomId: null, position: 0, total }
  }

  const position = index + 1 // 1-based
  const prevAtomId = index > 0 ? (orderedAtomIds[index - 1] ?? null) : null
  const nextAtomId = index < total - 1 ? (orderedAtomIds[index + 1] ?? null) : null

  return { prevAtomId, nextAtomId, position, total }
}
