import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface QuizResultsProps {
  score: number
  passingScore: number
  totalQuestions: number
  correctCount: number
  onRetry: () => void
  onReview: () => void
}

export default function QuizResults({
  score,
  passingScore,
  totalQuestions,
  correctCount,
  onRetry,
  onReview,
}: QuizResultsProps) {
  const passed = score >= passingScore
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - score / 100)

  useEffect(() => {
    if (passed) {
      import('canvas-confetti').then(m => {
        const confetti = m.default
        confetti({ origin: { x: 0.5, y: 0.7 }, particleCount: 80, spread: 70 })
      })
    }
  }, [passed])

  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      {/* SVG Score Circle */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
        <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="var(--surface-container-high)"
            strokeWidth={10}
          />
          <motion.circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke={passed ? 'var(--success, #69f6b8)' : 'var(--destructive, #ff6b6b)'}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--foreground)',
            }}
          >
            {Math.round(score)}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--foreground)', opacity: 0.5 }}>score</span>
        </div>
      </div>

      <h2
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '0.5rem',
        }}
      >
        {passed ? '🎉 Passed!' : '😅 Not quite'}
      </h2>
      <p
        style={{
          color: 'var(--foreground)',
          opacity: 0.6,
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
        }}
      >
        {correctCount}/{totalQuestions} correct · Passing score: {passingScore}%
      </p>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {!passed && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        )}
        <button
          onClick={onReview}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius)',
            background: 'var(--surface-container-high)',
            border: 'none',
            color: 'var(--foreground)',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
          }}
        >
          Review Answers
        </button>
      </div>
    </div>
  )
}
