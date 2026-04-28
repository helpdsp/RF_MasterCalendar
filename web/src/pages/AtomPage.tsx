import { useEffect, useState, useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMockData } from '@/hooks/useMockData'
import { useTrackProgress } from '@/hooks/useTrackProgress'
import AtomPageLayout from '@/components/atom-page/AtomPageLayout'
import TrackCompletionModal from '@/components/track/TrackCompletionModal'
import QuizPlayer from '@/components/atom-page/players/QuizPlayer'
import QuizResults from '@/components/atom-page/players/QuizResults'
import QuizReview from '@/components/atom-page/players/QuizReview'
import FlashcardDeck from '@/components/atom-page/players/FlashcardDeck'
import FlashcardTermsList from '@/components/atom-page/players/FlashcardTermsList'
import PlaybookReader from '@/components/atom-page/players/PlaybookReader'
import PlaybookTakeaways from '@/components/atom-page/players/PlaybookTakeaways'
import VideoPlayer from '@/components/atom-page/players/VideoPlayer'
import VideoNotes from '@/components/atom-page/players/VideoNotes'
import TaskInstructions from '@/components/atom-page/players/TaskInstructions'
import TaskChecklist from '@/components/atom-page/players/TaskChecklist'
import type {
  QuizContent, FlashcardContent, PlaybookContent, VideoContent, TaskContent,
} from '@/lib/types'

export default function AtomPage() {
  const { trackId, atomId } = useParams<{ trackId: string; atomId: string }>()
  const { state, dispatch } = useMockData()
  const { isComplete: isTrackComplete } = useTrackProgress(trackId ?? '')

  const [canComplete, setCanComplete] = useState(false)
  const [score, setScore] = useState<number | undefined>(undefined)
  const [showModal, setShowModal] = useState(false)
  // Quiz-specific: unlocked tabs after completion
  const [unlockedTabs, setUnlockedTabs] = useState<Set<string>>(new Set())
  // Quiz-specific: answers for review tab
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizScore, setQuizScore] = useState(0)

  const atom = atomId ? state.atoms[atomId] : undefined
  const track = trackId ? state.tracks.find(t => t.id === trackId) : undefined

  // START_ATOM on mount
  useEffect(() => {
    if (!atomId) return
    const progress = state.progress[atomId]
    if (!progress || progress.status === 'not_started') {
      dispatch({ type: 'START_ATOM', atomId })
    }
  }, [atomId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset per-atom state when navigating to a new atom
  useEffect(() => {
    setCanComplete(false)
    setScore(undefined)
    setUnlockedTabs(new Set())
    setQuizAnswers([])
    setQuizScore(0)
  }, [atomId])

  // Detect track completion after an atom is marked done
  const prevIsComplete = useState(isTrackComplete)[0]
  useEffect(() => {
    if (!prevIsComplete && isTrackComplete) {
      setShowModal(true)
    }
  }, [isTrackComplete, prevIsComplete])

  const handleCanComplete = useCallback((can: boolean) => setCanComplete(can), [])

  if (!trackId || !atomId || !atom || !track) return <Navigate to="/dashboard" replace />

  // Build tab content per atom type
  let tabContent: Partial<Record<string, React.ReactNode>> = {}

  if (atom.type === 'quiz') {
    const content = atom.content as QuizContent
    tabContent = {
      questions: (
        <QuizPlayer
          key={atomId}
          content={content}
          onCanCompleteChange={handleCanComplete}
          onScoreChange={(s) => { setScore(s); setQuizScore(s) }}
          onAnswersChange={setQuizAnswers}
          onUnlockTabs={(tabs) => setUnlockedTabs(new Set(tabs))}
        />
      ),
      results: (
        <QuizResults
          score={quizScore}
          passingScore={content.passingScore}
          totalQuestions={content.questions.length}
          correctCount={Math.round(quizScore / 100 * content.questions.length)}
          onRetry={() => {
            setCanComplete(false)
            setUnlockedTabs(new Set())
          }}
          onReview={() => setUnlockedTabs(prev => new Set([...prev, 'review']))}
        />
      ),
      review: <QuizReview questions={content.questions} userAnswers={quizAnswers} />,
    }
  } else if (atom.type === 'flashcard') {
    const content = atom.content as FlashcardContent
    tabContent = {
      cards: <FlashcardDeck key={atomId} content={content} onCanCompleteChange={handleCanComplete} />,
      terms: <FlashcardTermsList content={content} />,
    }
  } else if (atom.type === 'playbook') {
    const content = atom.content as PlaybookContent
    tabContent = {
      content: <PlaybookReader key={atomId} content={content} onCanCompleteChange={handleCanComplete} />,
      takeaways: <PlaybookTakeaways content={content} />,
    }
  } else if (atom.type === 'video') {
    const content = atom.content as VideoContent
    tabContent = {
      player: <VideoPlayer key={atomId} content={content} onCanCompleteChange={handleCanComplete} />,
      notes: <VideoNotes content={content} />,
    }
  } else if (atom.type === 'task') {
    const content = atom.content as TaskContent
    tabContent = {
      instructions: <TaskInstructions content={content} />,
      checklist: <TaskChecklist key={atomId} content={content} onCanCompleteChange={handleCanComplete} />,
    }
  }

  return (
    <>
      <motion.div
        key={atomId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <AtomPageLayout
          trackId={trackId}
          atomId={atomId}
          atom={atom}
          canComplete={canComplete}
          score={score}
          tabContent={tabContent}
          unlockedTabs={unlockedTabs}
        />
      </motion.div>

      {track && (
        <TrackCompletionModal
          track={track}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
