import { useReducer, useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { QuizContent, QuizQuestion } from '@/lib/types'
import ProgressBar from '@/components/common/ProgressBar'
import QuizResults from './QuizResults'
import QuizReview from './QuizReview'

// ---------------------------------------------------------------------------
// State machine types
// ---------------------------------------------------------------------------

type QuizPhase =
  | { phase: 'answering'; questionIndex: number; selected: number | null }
  | { phase: 'feedback'; questionIndex: number; selected: number; correct: boolean }
  | { phase: 'completed'; answers: number[]; score: number }

type QuizAction =
  | { type: 'SELECT'; index: number }
  | { type: 'SUBMIT'; questions: QuizQuestion[] }
  | { type: 'NEXT'; questions: QuizQuestion[]; answers: number[] }
  | { type: 'RETRY' }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function quizReducer(state: QuizPhase, action: QuizAction): QuizPhase {
  switch (action.type) {
    case 'SELECT': {
      if (state.phase !== 'answering') return state
      return { ...state, selected: action.index }
    }

    case 'SUBMIT': {
      if (state.phase !== 'answering') return state
      if (state.selected === null) return state
      const { questions } = action
      const correct = questions[state.questionIndex].correctIndex === state.selected
      return {
        phase: 'feedback',
        questionIndex: state.questionIndex,
        selected: state.selected,
        correct,
      }
    }

    case 'NEXT': {
      if (state.phase !== 'feedback') return state
      const { questions, answers } = action
      const newAnswers = [...answers]
      newAnswers[state.questionIndex] = state.selected

      const isLast = state.questionIndex === questions.length - 1
      if (isLast) {
        const correctCount = newAnswers.filter(
          (ans, i) => ans === questions[i].correctIndex,
        ).length
        const score = Math.round((correctCount / questions.length) * 100)
        return { phase: 'completed', answers: newAnswers, score }
      }

      return {
        phase: 'answering',
        questionIndex: state.questionIndex + 1,
        selected: null,
      }
    }

    case 'RETRY': {
      return { phase: 'answering', questionIndex: 0, selected: null }
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuizPlayerProps {
  content: QuizContent
  onCanCompleteChange: (can: boolean) => void
  onScoreChange: (score: number) => void
  onAnswersChange?: (answers: number[]) => void
  onUnlockTabs?: (tabs: string[]) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QuizPlayer({
  content,
  onCanCompleteChange,
  onScoreChange,
  onAnswersChange,
  onUnlockTabs,
}: QuizPlayerProps) {
  const { questions, passingScore } = content

  // We track accumulated answers separately so the reducer can be pure.
  const [answers, setAnswers] = useState<number[]>([])

  const [quizState, dispatch] = useReducer(quizReducer, {
    phase: 'answering',
    questionIndex: 0,
    selected: null,
  } satisfies QuizPhase)

  const [showReview, setShowReview] = useState(false)

  // Notify parent when quiz completes
  useEffect(() => {
    if (quizState.phase === 'completed') {
      onCanCompleteChange(quizState.score >= passingScore)
      onScoreChange(quizState.score)
      onAnswersChange?.(answers)
      onUnlockTabs?.(['results', 'review'])
    }
  }, [quizState.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Dispatch helpers
  // ---------------------------------------------------------------------------

  function handleSelect(index: number) {
    dispatch({ type: 'SELECT', index })
  }

  function handleSubmit() {
    dispatch({ type: 'SUBMIT', questions })
  }

  function handleNext() {
    if (quizState.phase !== 'feedback') return
    const newAnswers = [...answers]
    newAnswers[quizState.questionIndex] = quizState.selected
    setAnswers(newAnswers)
    dispatch({ type: 'NEXT', questions, answers: newAnswers })
  }

  function handleRetry() {
    setAnswers([])
    setShowReview(false)
    dispatch({ type: 'RETRY' })
  }

  // ---------------------------------------------------------------------------
  // Completed phase
  // ---------------------------------------------------------------------------

  if (quizState.phase === 'completed') {
    const completedAnswers = quizState.answers
    const correctCount = completedAnswers.filter(
      (ans, i) => ans === questions[i].correctIndex,
    ).length

    if (showReview) {
      return (
        <div style={{ padding: '1rem 0' }}>
          <button
            onClick={() => setShowReview(false)}
            style={{
              marginBottom: '1rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius)',
              background: 'var(--surface-container-high)',
              border: 'none',
              color: 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              opacity: 0.7,
            }}
          >
            ← Back to Results
          </button>
          <QuizReview questions={questions} userAnswers={completedAnswers} />
        </div>
      )
    }

    return (
      <QuizResults
        score={quizState.score}
        passingScore={passingScore}
        totalQuestions={questions.length}
        correctCount={correctCount}
        onRetry={handleRetry}
        onReview={() => setShowReview(true)}
      />
    )
  }

  // ---------------------------------------------------------------------------
  // Answering / Feedback phase
  // ---------------------------------------------------------------------------

  const { questionIndex } = quizState
  const question = questions[questionIndex]
  const progressValue = (questionIndex / questions.length) * 100

  const selectedIndex = quizState.selected

  const isLastQuestion = questionIndex === questions.length - 1

  function getOptionStyle(optionIdx: number): CSSProperties {
    const base: CSSProperties = {
      padding: '12px 16px',
      borderRadius: 10,
      background: 'var(--surface-container-low)',
      border: '2px solid transparent',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem',
      color: 'var(--foreground)',
      transition: 'border-color 150ms, background 150ms',
      width: '100%',
    }

    if (quizState.phase === 'feedback') {
      if (optionIdx === question.correctIndex) {
        return { ...base, background: 'var(--success, #69f6b8)', color: '#000', border: '2px solid transparent' }
      }
      if (optionIdx === quizState.selected && !quizState.correct) {
        return { ...base, background: 'var(--destructive, #ff6b6b)', color: '#fff', border: '2px solid transparent' }
      }
      return { ...base, opacity: 0.45 }
    }

    if (selectedIndex === optionIdx) {
      return { ...base, borderColor: 'var(--primary)' }
    }
    return base
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--foreground)',
            opacity: 0.5,
          }}
        >
          <span>Question {questionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <ProgressBar value={progressValue} animated />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${questionIndex}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--foreground)',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}
          >
            {question.text}
          </h3>

          {/* Options grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.625rem',
              marginBottom: '1.25rem',
            }}
          >
            {question.options.map((option, optIdx) => {
              const isWrongSelected =
                quizState.phase === 'feedback' &&
                !quizState.correct &&
                optIdx === quizState.selected

              return (
                <motion.button
                  key={optIdx}
                  style={getOptionStyle(optIdx)}
                  onClick={() => quizState.phase === 'answering' && handleSelect(optIdx)}
                  animate={isWrongSelected ? { x: [-8, 8, -8, 8, 0] } : {}}
                  transition={isWrongSelected ? { duration: 0.4 } : {}}
                  disabled={quizState.phase === 'feedback'}
                >
                  {option}
                </motion.button>
              )
            })}
          </div>

          {/* Feedback message */}
          {quizState.phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: '1rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 8,
                background: quizState.correct
                  ? 'color-mix(in srgb, var(--success, #69f6b8) 15%, transparent)'
                  : 'color-mix(in srgb, var(--destructive, #ff6b6b) 15%, transparent)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: quizState.correct ? 'var(--success, #69f6b8)' : 'var(--destructive, #ff6b6b)',
              }}
            >
              {quizState.correct ? 'Correct! ✓' : 'Not quite — see the highlighted answer above.'}
            </motion.div>
          )}

          {/* Action buttons */}
          {quizState.phase === 'answering' && (
            <button
              onClick={handleSubmit}
              disabled={quizState.selected === null}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                background:
                  quizState.selected !== null
                    ? 'linear-gradient(135deg, var(--primary), var(--primary-dim))'
                    : 'var(--surface-container-high)',
                border: 'none',
                color: quizState.selected !== null ? '#fff' : 'var(--foreground)',
                opacity: quizState.selected !== null ? 1 : 0.45,
                cursor: quizState.selected !== null ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'background 200ms, opacity 200ms',
              }}
            >
              Submit Answer
            </button>
          )}

          {quizState.phase === 'feedback' && (
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
