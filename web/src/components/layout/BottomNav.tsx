import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen } from 'lucide-react'

interface BottomNavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}

const navItems: BottomNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tracks', label: 'Tracks', icon: BookOpen },
]

export default function BottomNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: 'var(--surface-container-low)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            flex: 1,
            height: '100%',
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--foreground)',
            opacity: isActive ? 1 : 0.6,
            transition: 'color 0.15s ease, opacity 0.15s ease',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.6875rem',
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
