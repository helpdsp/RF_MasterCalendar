import GlassCard from '@/components/common/GlassCard'
import AnimatedCounter from '@/components/common/AnimatedCounter'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  suffix?: string
  colorVar?: string  // CSS var name like '--primary'
}

export default function StatCard({ icon: Icon, label, value, suffix = '', colorVar = '--primary' }: StatCardProps) {
  return (
    <GlassCard hover style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: '0.5rem',
          background: `color-mix(in srgb, var(${colorVar}) 15%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} style={{ color: `var(${colorVar})` }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.65 }}>{label}</span>
      </div>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '1.75rem',
        fontWeight: 700,
        color: 'var(--foreground)',
      }}>
        <AnimatedCounter value={value} />{suffix}
      </div>
    </GlassCard>
  )
}
