import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import type { VideoContent } from '@/lib/types'

interface VideoPlayerProps {
  content: VideoContent
  onCanCompleteChange: (can: boolean) => void
}

export default function VideoPlayer({ content, onCanCompleteChange }: VideoPlayerProps) {
  const { durationSeconds } = content
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          const next = Math.min(t + 1, durationSeconds)
          if (next / durationSeconds >= 0.8) onCanCompleteChange(true)
          if (next >= durationSeconds) setPlaying(false)
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, durationSeconds, onCanCompleteChange])

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const progress = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    setCurrentTime(Math.floor(ratio * durationSeconds))
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Video screen */}
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        background: 'linear-gradient(135deg, #0a0f1e, #1a0a2e)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        marginBottom: '1rem',
      }}>
        {/* Fake video content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.5rem',
        }}>
          <div style={{ fontSize: '3rem', opacity: 0.2 }}>▶</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>
            {playing ? 'Playing…' : 'Paused'}
          </div>
        </div>

        {/* Controls overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0.75rem 1rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          backdropFilter: 'blur(4px)',
        }}>
          {/* Progress bar (clickable) */}
          <div
            onClick={seekTo}
            style={{
              height: 4, background: 'rgba(255,255,255,0.2)',
              borderRadius: 2, marginBottom: '0.625rem', cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--primary-dim))',
              borderRadius: 2, transition: 'width 0.5s linear',
            }} />
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setPlaying(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 4 }}
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
              {formatTime(currentTime)} / {formatTime(durationSeconds)}
            </span>
            <div style={{ flex: 1 }} />
            <Volume2 size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      </div>

      {progress >= 80 && (
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--success, #69f6b8)', marginBottom: '0.5rem' }}>
          ✓ 80% watched — ready to complete
        </div>
      )}
    </div>
  )
}
