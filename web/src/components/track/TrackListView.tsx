import { useMemo } from 'react'
import { useMockData } from '@/hooks/useMockData'
import CellAccordion from './CellAccordion'
import type { Track } from '@/lib/types'

interface TrackListViewProps { track: Track }

export default function TrackListView({ track }: TrackListViewProps) {
  const { state } = useMockData()

  // Find current cell index (first cell with any incomplete atom)
  const currentCellIndex = useMemo(() => {
    return track.cellIds.findIndex(cellId => {
      const cell = state.cells[cellId]
      return cell?.atomIds.some(atomId => state.progress[atomId]?.status !== 'completed')
    })
  }, [track.cellIds, state.cells, state.progress])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {track.cellIds.map((cellId, index) => {
        const cell = state.cells[cellId]
        if (!cell) return null
        // Auto-expand current cell, collapse completed cells
        const defaultOpen = index === currentCellIndex
        return (
          <CellAccordion
            key={cellId}
            cell={cell}
            trackId={track.id}
            defaultOpen={defaultOpen}
          />
        )
      })}
    </div>
  )
}
