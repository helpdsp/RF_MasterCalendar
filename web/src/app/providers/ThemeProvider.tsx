import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { applySkin } from '@/lib/theme/apply-skin'

type Skin = 'velocity_dark' | 'velocity_pro'

interface ThemeContextValue {
  skin: Skin
  toggleSkin: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialSkin(): Skin {
  const stored = localStorage.getItem('skin')
  if (stored === 'velocity_dark' || stored === 'velocity_pro') {
    return stored
  }
  return 'velocity_dark'
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [skin, setSkin] = useState<Skin>(getInitialSkin)

  useEffect(() => {
    applySkin(skin)
    localStorage.setItem('skin', skin)
  }, [skin])

  function toggleSkin() {
    setSkin((prev) => (prev === 'velocity_dark' ? 'velocity_pro' : 'velocity_dark'))
  }

  return (
    <ThemeContext.Provider value={{ skin, toggleSkin }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
