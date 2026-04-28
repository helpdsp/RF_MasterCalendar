import { Clock } from 'lucide-react'
import type { Atom } from '@/lib/types'

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  video:     { label: 'Video',     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  quiz:      { label: 'Quiz',      color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  flashcard: { label: 'Flashcard', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  playbook:  { label: 'Playbook',  color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  task:      { label: 'Task',      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
}

export default function AtomHeader({ atom }: { atom: Atom }) {
  const cfg = TYPE_CONFIG[atom.type] ?? { label: atom.type, color: 'var(--primary)', bg: 'color-mix(in srgb, var(--primary) 12%, transparent)' }

  return (
    <div style={{ padding: '1.5rem 0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{
          padding: '3px 10px', borderRadius: '999px',
          background: cfg.bg, color: cfg.color,
          fontSize: '0.75rem', fontWeight: 600,
        }}>{cfg.label}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.55 }}>
          <Clock size={13} />
          {atom.estimatedMinutes} min
        </span>
      </div>
      <h1 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 800, color: 'var(--foreground)',
        lineHeight: 1.2,
      }}>{atom.title}</h1>
    </div>
  )
}
