import React, { createContext, useContext, useReducer } from 'react'
import type { MockState, AtomProgress } from '@/lib/types'
import { mockUser } from '@/data/mock-user'
import { mockTracks, mockCells } from '@/data/mock-tracks'
import { mockAtoms } from '@/data/mock-atoms'
import { mockProgress, mockStreak, mockStats } from '@/data/mock-progress'
import { mockLeaderboard } from '@/data/mock-leaderboard'

// ─── Action types ─────────────────────────────────────────────────────────────

type MockDataAction =
  | { type: 'COMPLETE_ATOM'; atomId: string; score?: number }
  | { type: 'START_ATOM'; atomId: string }
  | { type: 'RESET_PROGRESS' }
  | { type: 'CLEAR_LAST_COMPLETED' }

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: MockState = {
  user: mockUser,
  tracks: mockTracks,
  cells: mockCells,
  atoms: mockAtoms,
  progress: mockProgress,
  streak: mockStreak,
  stats: mockStats,
  leaderboard: mockLeaderboard,
  lastCompletedAtomId: null,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function mockDataReducer(state: MockState, action: MockDataAction): MockState {
  switch (action.type) {
    case 'COMPLETE_ATOM': {
      const existing = state.progress[action.atomId]
      if (existing?.status === 'completed') return state

      const updatedProgress: AtomProgress = {
        atomId: action.atomId,
        status: 'completed',
        completedAt: new Date().toISOString(),
        score: action.score ?? null,
      }

      const wasCompleted = (existing?.status as string) === 'completed'
      const atomsCompletedDelta = wasCompleted ? 0 : 1
      const atom = state.atoms[action.atomId]
      const minutesDelta = atom ? atom.estimatedMinutes : 0

      const todayKey = new Date().toISOString().split('T')[0]
      const currentDayCount = state.stats.weeklyActivity[todayKey] ?? 0

      return {
        ...state,
        lastCompletedAtomId: action.atomId,
        progress: {
          ...state.progress,
          [action.atomId]: updatedProgress,
        },
        stats: {
          ...state.stats,
          atomsCompleted: state.stats.atomsCompleted + atomsCompletedDelta,
          atomsThisWeek: state.stats.atomsThisWeek + atomsCompletedDelta,
          totalMinutes: state.stats.totalMinutes + minutesDelta,
          weeklyActivity: {
            ...state.stats.weeklyActivity,
            [todayKey]: currentDayCount + atomsCompletedDelta,
          },
        },
      }
    }

    case 'START_ATOM': {
      const existing = state.progress[action.atomId]
      if (existing?.status !== 'not_started') return state

      return {
        ...state,
        progress: {
          ...state.progress,
          [action.atomId]: {
            atomId: action.atomId,
            status: 'in_progress',
            completedAt: null,
            score: null,
          },
        },
      }
    }

    case 'RESET_PROGRESS': {
      return {
        ...state,
        progress: mockProgress,
        stats: mockStats,
        streak: mockStreak,
        lastCompletedAtomId: null,
      }
    }

    case 'CLEAR_LAST_COMPLETED': {
      return { ...state, lastCompletedAtomId: null }
    }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MockDataContext = createContext<{
  state: MockState
  dispatch: React.Dispatch<MockDataAction>
} | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mockDataReducer, initialState)

  return (
    <MockDataContext.Provider value={{ state, dispatch }}>
      {children}
    </MockDataContext.Provider>
  )
}

// ─── Context hook ─────────────────────────────────────────────────────────────

export function useMockDataContext() {
  const ctx = useContext(MockDataContext)
  if (ctx === null) {
    throw new Error('useMockDataContext must be used within a MockDataProvider')
  }
  return ctx
}
