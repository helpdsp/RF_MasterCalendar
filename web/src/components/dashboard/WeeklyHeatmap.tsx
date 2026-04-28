import { useMockData } from '@/hooks/useMockData'
import GlassCard from '@/components/common/GlassCard'

export default function WeeklyHeatmap() {
  const { state } = useMockData()

  // Generate last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const count = state.stats.weeklyActivity[key] ?? 0
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    return { key, count, label }
  })

  function getColor(count: number): string {
    if (count === 0) return 'var(--surface-container-low)'
    if (count <= 2) return 'color-mix(in srgb, var(--primary) 30%, transparent)'
    if (count <= 5) return 'color-mix(in srgb, var(--primary) 60%, transparent)'
    return 'var(--primary)'
  }

  return (
    <GlassCard style={{ padding: '1.5rem' }}>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1rem' }}>
        Weekly Activity
      </h3>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        {days.map(({ key, count, label }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div
              title={`${count} atoms — ${key}`}
              style={{
                width: 36, height: 36,
                borderRadius: '8px',
                background: getColor(count),
                transition: 'background 300ms',
              }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--foreground)', opacity: 0.5 }}>{label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
