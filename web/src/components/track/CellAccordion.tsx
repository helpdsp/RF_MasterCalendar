import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Cell } from '@/lib/types'
import AtomListItem from './AtomListItem'
import { useMockData } from '@/hooks/useMockData'

interface CellAccordionProps {
  cell: Cell
  trackId: string
  defaultOpen?: boolean
}

export default function CellAccordion({ cell, trackId, defaultOpen = false }: CellAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { state } = useMockData()

  const completedCount = cell.atomIds.filter(id => state.progress[id]?.status === 'completed').length

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          borderRadius: open ? '12px 12px 0 0' : '12px',
          background: 'var(--surface-container-low)',
          border: 'none', cursor: 'pointer',
          transition: 'border-radius 200ms',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.9rem', fontWeight: 600,
            color: 'var(--foreground)',
          }}>{cell.title}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.5 }}>
            {completedCount}/{cell.atomIds.length} completed
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} style={{ color: 'var(--foreground)', opacity: 0.6 }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', background: 'var(--surface-container-low)', borderRadius: '0 0 12px 12px' }}
          >
            <div style={{ padding: '0.25rem 0 0.5rem' }}>
              {cell.atomIds.map((atomId, index) => (
                <AtomListItem
                  key={atomId}
                  atomId={atomId}
                  trackId={trackId}
                  isLast={index === cell.atomIds.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
