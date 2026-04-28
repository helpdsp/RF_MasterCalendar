import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Square } from 'lucide-react'
import type { TaskContent } from '@/lib/types'

interface TaskChecklistProps {
  content: TaskContent
  onCanCompleteChange: (can: boolean) => void
}

export default function TaskChecklist({ content, onCanCompleteChange }: TaskChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
    onCanCompleteChange(next.size === content.checklistItems.length)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>
          Checklist
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.5 }}>
          {checked.size}/{content.checklistItems.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {content.checklistItems.map(item => {
          const done = checked.has(item.id)
          return (
            <motion.button
              key={item.id}
              onClick={() => toggle(item.id)}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', gap: '0.75rem', alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: done ? 'color-mix(in srgb, var(--success, #69f6b8) 10%, transparent)' : 'var(--surface-container-low)',
                border: `1px solid ${done ? 'color-mix(in srgb, var(--success, #69f6b8) 25%, transparent)' : 'transparent'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms',
                width: '100%',
              }}
            >
              <span style={{ color: done ? 'var(--success, #69f6b8)' : 'var(--foreground)', opacity: done ? 1 : 0.4, flexShrink: 0 }}>
                {done ? <CheckSquare size={18} /> : <Square size={18} />}
              </span>
              <span style={{
                fontSize: '0.875rem', color: 'var(--foreground)',
                opacity: done ? 0.6 : 0.85,
                textDecoration: done ? 'line-through' : 'none',
                transition: 'all 200ms',
              }}>{item.label}</span>
            </motion.button>
          )
        })}
      </div>

      {checked.size === content.checklistItems.length && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--success, #69f6b8)', fontSize: '0.875rem', fontWeight: 600 }}
        >
          ✓ All tasks done — ready to complete!
        </motion.div>
      )}
    </div>
  )
}
