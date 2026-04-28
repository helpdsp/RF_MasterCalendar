import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow, Background, Controls,
  type Node, type Edge, type NodeMouseHandler,
  useNodesState, useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import AtomNode from './AtomNode'
import AnimatedEdge from './AnimatedEdge'
import { applyDagreLayout } from '@/lib/dagre-layout'
import { useMockData } from '@/hooks/useMockData'
import type { Track } from '@/lib/types'

const nodeTypes = { atomNode: AtomNode }
const edgeTypes = { animatedEdge: AnimatedEdge }

interface NodeGraphCanvasProps { track: Track }

export default function NodeGraphCanvas({ track }: NodeGraphCanvasProps) {
  const navigate = useNavigate()
  const { state } = useMockData()

  // Determine "current" atom (first not completed)
  const currentAtomId = useMemo(() => {
    for (const cellId of track.cellIds) {
      const cell = state.cells[cellId]
      if (!cell) continue
      for (const atomId of cell.atomIds) {
        if (state.progress[atomId]?.status !== 'completed') return atomId
      }
    }
    return null
  }, [track, state.cells, state.progress])

  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes: Node[] = []
    const rawEdges: Edge[] = []

    track.cellIds.forEach(cellId => {
      const cell = state.cells[cellId]
      if (!cell) return

      let prevAtomId: string | null = null
      cell.atomIds.forEach(atomId => {
        const atom = state.atoms[atomId]
        if (!atom) return

        const progress = state.progress[atomId]
        const status = atomId === currentAtomId ? 'current' :
          (progress?.status === 'completed' ? 'completed' :
           progress?.status === 'in_progress' ? 'in_progress' : 'not_started')

        rawNodes.push({
          id: atomId,
          type: 'atomNode',
          position: { x: 0, y: 0 },
          data: {
            label: atom.title,
            type: atom.type,
            status,
            estimatedMinutes: atom.estimatedMinutes,
          },
        })

        if (prevAtomId) {
          rawEdges.push({
            id: `${prevAtomId}-${atomId}`,
            source: prevAtomId,
            target: atomId,
            type: 'animatedEdge',
          })
        }
        prevAtomId = atomId
      })
    })

    const layoutedNodes = applyDagreLayout(rawNodes, rawEdges)
    return { initialNodes: layoutedNodes, initialEdges: rawEdges }
  }, [track, state, currentAtomId])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    navigate(`/tracks/${track.id}/atoms/${node.id}`)
  }, [navigate, track.id])

  return (
    <div style={{ width: '100%', height: 500, borderRadius: 16, overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: 'var(--surface-container-low)' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--surface-container-high)" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
