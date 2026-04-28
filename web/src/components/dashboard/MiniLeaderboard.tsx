import GlassCard from '@/components/common/GlassCard'
import { useMockData } from '@/hooks/useMockData'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function MiniLeaderboard() {
  const { state } = useMockData()

  return (
    <GlassCard style={{ padding: '1.5rem' }}>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1rem' }}>
        Leaderboard
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {state.leaderboard.map(entry => (
          <div key={entry.userId} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px',
            borderRadius: 'var(--radius)',
            background: entry.isCurrentUser ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
          }}>
            <span style={{ width: 20, fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)', opacity: 0.5 }}>
              #{entry.rank}
            </span>
            <img src={entry.avatarUrl} alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
            <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: entry.isCurrentUser ? 600 : 400, color: 'var(--foreground)' }}>
              {entry.displayName}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.6 }}>{entry.atomsCompleted}</span>
            <span style={{ width: 16 }}>
              {entry.change > 0 ? <TrendingUp size={14} style={{ color: 'var(--success)' }} /> :
               entry.change < 0 ? <TrendingDown size={14} style={{ color: 'var(--destructive)' }} /> :
               <Minus size={14} style={{ color: 'var(--foreground)', opacity: 0.4 }} />}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
