import type { AtomProgress, UserStreak, UserStats } from '@/lib/types'

// All atom IDs that exist in the system
const ALL_ATOM_IDS = [
  // track-react-hooks
  'atom-hooks-intro',
  'atom-hooks-quiz',
  'atom-hooks-flashcards',
  'atom-hooks-playbook',
  'atom-hooks-task',
  'atom-hooks-usecontext',
  'atom-hooks-usereducer',
  'atom-hooks-patterns-video',
  'atom-hooks-testing-quiz',
  'atom-hooks-testing-task',
  'atom-hooks-patterns-flashcards',
  'atom-hooks-review-playbook',
  // track-typescript
  'atom-ts-types',
  'atom-ts-quiz',
  'atom-ts-intro-video',
  'atom-ts-basics-task',
  'atom-ts-playbook',
  'atom-ts-advanced-quiz',
  'atom-ts-generics-flashcards',
  'atom-ts-final-task',
]

const completedAt2024 = '2024-03-10T14:22:00Z'
const completedAtRecent = '2026-04-05T09:15:00Z'

const completedAtoms: Record<string, AtomProgress> = {
  'atom-hooks-intro': {
    atomId: 'atom-hooks-intro',
    status: 'completed',
    completedAt: completedAt2024,
    score: null,
  },
  'atom-hooks-flashcards': {
    atomId: 'atom-hooks-flashcards',
    status: 'completed',
    completedAt: completedAt2024,
    score: null,
  },
  'atom-ts-types': {
    atomId: 'atom-ts-types',
    status: 'completed',
    completedAt: completedAtRecent,
    score: null,
  },
}

const inProgressAtoms: Record<string, AtomProgress> = {
  'atom-hooks-quiz': {
    atomId: 'atom-hooks-quiz',
    status: 'in_progress',
    completedAt: null,
    score: null,
  },
}

const notStartedAtoms: Record<string, AtomProgress> = Object.fromEntries(
  ALL_ATOM_IDS.filter(
    (id) => !(id in completedAtoms) && !(id in inProgressAtoms),
  ).map((id) => [
    id,
    {
      atomId: id,
      status: 'not_started' as const,
      completedAt: null,
      score: null,
    },
  ]),
)

export const mockProgress: Record<string, AtomProgress> = {
  ...completedAtoms,
  ...inProgressAtoms,
  ...notStartedAtoms,
}

export const mockStreak: UserStreak = {
  currentStreak: 14,
  maxStreak: 21,
  lastActivityDate: new Date().toISOString().split('T')[0],
}

// Build weeklyActivity for the last 7 days
function buildWeeklyActivity(): Record<string, number> {
  const activity: Record<string, number> = {}
  const today = new Date()
  // Realistic daily atom counts over the past week
  const dayCounts = [2, 0, 3, 1, 4, 2, 1]
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    activity[key] = dayCounts[6 - i]
  }
  return activity
}

export const mockStats: UserStats = {
  atomsCompleted: 63,
  atomsThisWeek: 13,
  totalMinutes: 847,
  weeklyActivity: buildWeeklyActivity(),
}
