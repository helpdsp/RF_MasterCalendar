import { useMockData } from '@/hooks/useMockData'
import TrackCard from './TrackCard'

export default function ContinueLearningSection() {
  const { state } = useMockData()
  const tracks = state.tracks.slice(0, 3)

  return (
    <div>
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '1.1rem', fontWeight: 700,
        color: 'var(--foreground)', marginBottom: '1rem',
      }}>Continue Learning</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
      }}>
        {tracks.map(track => <TrackCard key={track.id} track={track} />)}
      </div>
    </div>
  )
}
