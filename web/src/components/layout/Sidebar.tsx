import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import UserMenu from './UserMenu'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tracks', label: 'Tracks', icon: BookOpen },
]

export default function Sidebar() {
  const { skin, toggleSkin } = useTheme()

  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        minHeight: '100vh',
        backgroundColor: 'var(--surface-container-low)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px' }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '1.375rem',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          FastTrack
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              marginBottom: 4,
              textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--foreground)',
              backgroundColor: isActive ? 'var(--surface-container-high)' : 'transparent',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.9375rem',
              position: 'relative',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      borderRadius: '0 2px 2px 0',
                      backgroundColor: 'var(--primary)',
                    }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div style={{ padding: '12px 20px' }}>
        <button
          onClick={toggleSkin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 'var(--radius)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.875rem',
            width: '100%',
            opacity: 0.7,
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          aria-label="Toggle theme"
        >
          {skin === 'velocity_dark' ? <Sun size={16} /> : <Moon size={16} />}
          {skin === 'velocity_dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* User menu */}
      <div style={{ padding: '12px 20px 20px' }}>
        <UserMenu />
      </div>
    </aside>
  )
}
