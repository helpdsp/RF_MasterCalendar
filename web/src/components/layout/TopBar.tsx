import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { mockUser } from '@/data/mock-user'

export default function TopBar() {
  const { skin, toggleSkin } = useTheme()

  return (
    <header
      style={{
        height: 56,
        backgroundColor: 'var(--surface-container-low)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: '1.125rem',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
        }}
      >
        FastTrack
      </span>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleSkin}
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          aria-label="Toggle theme"
        >
          {skin === 'velocity_dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'var(--surface-container-high)',
            flexShrink: 0,
          }}
        >
          <img
            src={mockUser.avatarUrl}
            alt={mockUser.displayName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  )
}
