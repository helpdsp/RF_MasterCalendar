import { useMockData } from '@/hooks/useMockData'
import type { AtomProgress } from '@/lib/types'

export interface UseAtomCompletionReturn {
  progress: AtomProgress | undefined
  complete: (score?: number) => void
  start: () => void
}

/**
 * Provides progress state and action dispatchers for a single atom.
 *
 * @param atomId - The ID of the atom to track.
 */
export function useAtomCompletion(atomId: string): UseAtomCompletionReturn {
  const { state, dispatch } = useMockData()
  const progress = state.progress[atomId]

  const complete = (score?: number) =>
    dispatch({ type: 'COMPLETE_ATOM', atomId, score })

  const start = () => dispatch({ type: 'START_ATOM', atomId })

  return { progress, complete, start }
}
