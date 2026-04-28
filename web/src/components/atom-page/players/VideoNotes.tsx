import { useState } from 'react'
import type { VideoContent } from '@/lib/types'

function formatTimestamp(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function VideoNotes({ content }: { content: VideoContent }) {
  const [activeNote, setActiveNote] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.45, marginBottom: '0.5rem' }}>
        Click a timestamp to jump to that point in the video.
      </p>
      {content.notes.map((note, i) => (
        <button
          key={i}
          onClick={() => setActiveNote(i)}
          style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: activeNote === i ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'var(--surface-container-low)',
            border: activeNote === i ? '1px solid color-mix(in srgb, var(--primary) 25%, transparent)' : '1px solid transparent',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 150ms',
            width: '100%',
          }}
        >
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--primary)', flexShrink: 0,
            paddingTop: '2px',
          }}>
            {formatTimestamp(note.timestampSeconds)}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--foreground)', opacity: 0.8, lineHeight: 1.5 }}>
            {note.text}
          </span>
        </button>
      ))}
    </div>
  )
}
