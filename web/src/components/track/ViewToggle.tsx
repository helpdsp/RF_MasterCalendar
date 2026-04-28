import { Network, List } from 'lucide-react'

interface ViewToggleProps {
  view: 'graph' | 'list'
  onChange: (v: 'graph' | 'list') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div style={{
      display: 'inline-flex',
      borderRadius: '10px',
      background: 'var(--surface-container-low)',
      padding: '3px',
      gap: '2px',
    }}>
      {(['graph', 'list'] as const).map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          title={v === 'graph' ? 'Node Graph' : 'List View'}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            background: view === v ? 'var(--surface-bright)' : 'transparent',
            color: view === v ? 'var(--primary)' : 'var(--foreground)',
            opacity: view === v ? 1 : 0.5,
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8rem',
            fontWeight: view === v ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
        >
          {v === 'graph' ? <Network size={14} /> : <List size={14} />}
          {v === 'graph' ? 'Graph' : 'List'}
        </button>
      ))}
    </div>
  )
}
