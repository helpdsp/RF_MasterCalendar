import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  animated?: boolean
  className?: string
}

export default function ProgressBar({ value, animated = false, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className={cn(className)}
      style={{
        height: 6,
        borderRadius: 4,
        background: 'var(--surface-container-high)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          borderRadius: 4,
          transition: animated ? 'width 600ms ease-out' : undefined,
        }}
      />
    </div>
  )
}
