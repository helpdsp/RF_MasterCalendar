import { memo, useEffect, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import { useMockData } from '@/hooks/useMockData'

type AtomNodeStatus = 'completed' | 'in_progress' | 'current' | 'not_started'

interface AtomNodeData {
  label: string
  type: string
  status: AtomNodeStatus
  estimatedMinutes: number
  [key: string]: unknown
}

const TYPE_ICONS: Record<string, string> = {
  video: '▶',
  quiz: '❓',
  flashcard: '🃏',
  playbook: '📖',
  task: '✅',
}

const STATUS_RING: Record<AtomNodeStatus, string> = {
  completed: 'var(--success, #69f6b8)',
  in_progress: 'var(--warning, #ffd166)',
  current: 'var(--primary)',
  not_started: 'transparent',
}

function AtomNode({ data, id }: NodeProps) {
  const nodeData = data as AtomNodeData
  const { label, type, status, estimatedMinutes } = nodeData
  const ringColor = STATUS_RING[status]
  const isDim = status === 'not_started'
  const { state, dispatch } = useMockData()
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    if (state.lastCompletedAtomId === id) {
      setFlashing(true)
      const t = setTimeout(() => {
        setFlashing(false)
        dispatch({ type: 'CLEAR_LAST_COMPLETED' })
      }, 800)
      return () => clearTimeout(t)
    }
  }, [state.lastCompletedAtomId, id, dispatch])

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        animate={
          flashing ? {
            boxShadow: [
              '0 0 0 3px var(--success, #69f6b8), 0 0 24px rgba(105,246,184,0.6)',
              '0 0 0 6px var(--success, #69f6b8), 0 0 40px rgba(105,246,184,0.8)',
              '0 0 0 2px var(--success, #69f6b8)',
            ],
            scale: [1, 1.04, 1],
          } : status === 'current' ? {
            boxShadow: [
              `0 0 0 2px ${ringColor}, 0 0 8px color-mix(in srgb, var(--primary) 40%, transparent)`,
              `0 0 0 2px ${ringColor}, 0 0 20px color-mix(in srgb, var(--primary) 60%, transparent)`,
              `0 0 0 2px ${ringColor}, 0 0 8px color-mix(in srgb, var(--primary) 40%, transparent)`,
            ],
          } : {
            boxShadow: ringColor !== 'transparent' ? `0 0 0 2px ${ringColor}` : 'none',
          }
        }
        transition={flashing ? { duration: 0.8 } : status === 'current' ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
        style={{
          width: 200,
          height: 80,
          borderRadius: 12,
          background: 'var(--surface-bright)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 10,
          opacity: isDim ? 0.45 : 1,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{TYPE_ICONS[type] ?? '•'}</span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 600,
            color: 'var(--foreground)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{label}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--foreground)', opacity: 0.55, marginTop: 2 }}>
            {estimatedMinutes}m · {status.replace('_', ' ')}
          </div>
        </div>
        {status === 'completed' && (
          <span style={{ color: 'var(--success, #69f6b8)', flexShrink: 0, fontSize: '1rem' }}>✓</span>
        )}
      </motion.div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  )
}

export default memo(AtomNode)
