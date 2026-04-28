import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface TracksSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function TracksSearchBar({ value, onChange }: TracksSearchBarProps) {
  const [local, setLocal] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external reset (e.g. clear filters)
  useEffect(() => {
    if (value === '') setLocal('')
  }, [value])

  function handleChange(raw: string) {
    setLocal(raw)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(raw), 300)
  }

  function handleClear() {
    setLocal('')
    onChange('')
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: 14,
          color: 'var(--foreground)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search tracks…"
        style={{
          width: '100%',
          paddingLeft: 40,
          paddingRight: local ? 40 : 16,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'var(--surface-bright)',
          color: 'var(--foreground)',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.9375rem',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      {local && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--foreground)',
            opacity: 0.5,
            padding: 2,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
