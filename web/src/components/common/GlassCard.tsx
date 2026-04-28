import { useState } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export default function GlassCard({ children, className, hover = false, style, onClick }: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  function getTransform() {
    if (!hover) return undefined
    if (isPressed) return 'translateY(-2px) scale(0.99)'
    if (isHovered) return 'translateY(-2px)'
    return undefined
  }

  return (
    <div
      className={cn(className)}
      style={{
        backdropFilter: 'blur(16px)',
        background: 'var(--surface-bright)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius)',
        transition: hover ? 'transform 200ms, box-shadow 200ms' : undefined,
        transform: getTransform(),
        boxShadow: hover && isHovered ? '0 8px 32px rgba(0,0,0,0.2)' : undefined,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={hover ? () => setIsHovered(true) : undefined}
      onMouseLeave={hover ? () => { setIsHovered(false); setIsPressed(false) } : undefined}
      onMouseDown={hover ? () => setIsPressed(true) : undefined}
      onMouseUp={hover ? () => setIsPressed(false) : undefined}
    >
      {children}
    </div>
  )
}
