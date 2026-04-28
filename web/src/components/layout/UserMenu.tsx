import { mockUser } from '@/data/mock-user'

export default function UserMenu() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
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

      {/* Name + level badge */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            color: 'var(--foreground)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {mockUser.displayName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--background)',
              backgroundColor: 'var(--primary)',
              padding: '1px 6px',
              borderRadius: '999px',
              letterSpacing: '0.02em',
            }}
          >
            Lv.{mockUser.level}
          </span>
        </div>
      </div>
    </div>
  )
}
