import { velocityDark, velocityPro } from './skins'

export function applySkin(skin: 'velocity_dark' | 'velocity_pro'): void {
  const tokens = skin === 'velocity_dark' ? velocityDark : velocityPro
  const root = document.documentElement

  for (const [property, value] of Object.entries(tokens)) {
    root.style.setProperty(property, value)
  }
}
