import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useAtomCompletion } from '@/hooks/useAtomCompletion'
import { Toaster, toast } from 'sonner'

interface CompletionButtonProps {
  atomId: string
  canComplete?: boolean
  score?: number
}

type BtnState = 'disabled' | 'enabled' | 'completing' | 'completed'

export default function CompletionButton({ atomId, canComplete = false, score }: CompletionButtonProps) {
  const { progress, complete } = useAtomCompletion(atomId)
  const [state, setState] = useState<BtnState>(
    progress?.status === 'completed' ? 'completed' : 'disabled'
  )

  // Sync with canComplete prop
  const effectiveState: BtnState =
    state === 'completed' ? 'completed' :
    state === 'completing' ? 'completing' :
    canComplete ? 'enabled' : 'disabled'

  async function handleClick() {
    if (effectiveState !== 'enabled') return
    setState('completing')
    await new Promise(r => setTimeout(r, 600))
    complete(score)
    setState('completed')
    toast.success('Atom completed! 🎉', { duration: 3000 })
  }

  const isCompleted = effectiveState === 'completed'
  const isDisabled = effectiveState === 'disabled'
  const isCompleting = effectiveState === 'completing'

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <motion.button
        onClick={handleClick}
        disabled={isDisabled || isCompleted || isCompleting}
        animate={isCompleting ? { scale: [1, 1.15, 0.95, 1] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '0.5rem 1.25rem',
          borderRadius: 'var(--radius)',
          border: 'none',
          background: isCompleted
            ? 'var(--success, #69f6b8)'
            : isDisabled
            ? 'var(--surface-container-high)'
            : 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          color: isCompleted ? '#0a2a1a' : isDisabled ? 'var(--foreground)' : '#fff',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.875rem', fontWeight: 600,
          cursor: isDisabled || isCompleted ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          transition: 'background 300ms, color 300ms, opacity 200ms',
          pointerEvents: isCompleted ? 'none' : 'auto',
        }}
      >
        {(isCompleted || isCompleting) && <Check size={15} />}
        {isCompleted ? 'Completed!' : isCompleting ? 'Saving…' : 'Mark Complete'}
      </motion.button>
    </>
  )
}
