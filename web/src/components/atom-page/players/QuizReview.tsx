import { CheckCircle2, XCircle } from 'lucide-react'
import type { QuizQuestion } from '@/lib/types'

interface QuizReviewProps {
  questions: QuizQuestion[]
  userAnswers: number[]
}

export default function QuizReview({ questions, userAnswers }: QuizReviewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {questions.map((q, i) => {
        const userIdx = userAnswers[i]
        const correct = userIdx === q.correctIndex
        return (
          <div
            key={q.id}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'var(--surface-container-low)',
              borderLeft: `4px solid ${correct ? 'var(--success, #69f6b8)' : 'var(--destructive, #ff6b6b)'}`,
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {correct ? (
                <CheckCircle2
                  size={18}
                  style={{ color: 'var(--success, #69f6b8)', flexShrink: 0 }}
                />
              ) : (
                <XCircle
                  size={18}
                  style={{ color: 'var(--destructive, #ff6b6b)', flexShrink: 0 }}
                />
              )}
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                }}
              >
                {q.text}
              </span>
            </div>
            {!correct && (
              <div
                style={{
                  fontSize: '0.8rem',
                  marginBottom: '0.5rem',
                  padding: '0 1.5rem',
                }}
              >
                <span style={{ color: 'var(--destructive, #ff6b6b)' }}>Your answer: </span>
                <span style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {q.options[userIdx]}
                </span>
                <br />
                <span style={{ color: 'var(--success, #69f6b8)' }}>Correct: </span>
                <span style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {q.options[q.correctIndex]}
                </span>
              </div>
            )}
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--foreground)',
                opacity: 0.55,
                padding: '0.5rem 0.75rem',
                background: 'var(--surface-container-high)',
                borderRadius: '6px',
                marginLeft: '1.5rem',
              }}
            >
              💡 {q.reviewHint}
            </div>
          </div>
        )
      })}
    </div>
  )
}
