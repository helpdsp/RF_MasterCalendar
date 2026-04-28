import type { Track, Cell } from '@/lib/types'

export const mockCells: Record<string, Cell> = {
  'cell-hooks-fundamentals': {
    id: 'cell-hooks-fundamentals',
    title: 'Fundamentos de Hooks',
    atomIds: [
      'atom-hooks-intro',
      'atom-hooks-quiz',
      'atom-hooks-flashcards',
    ],
  },
  'cell-hooks-advanced': {
    id: 'cell-hooks-advanced',
    title: 'Hooks Avanzados',
    atomIds: [
      'atom-hooks-playbook',
      'atom-hooks-task',
      'atom-hooks-usecontext',
      'atom-hooks-usereducer',
    ],
  },
  'cell-hooks-patterns': {
    id: 'cell-hooks-patterns',
    title: 'Patrones y Testing',
    atomIds: [
      'atom-hooks-patterns-video',
      'atom-hooks-testing-quiz',
      'atom-hooks-testing-task',
      'atom-hooks-patterns-flashcards',
      'atom-hooks-review-playbook',
    ],
  },
  'cell-ts-fundamentals': {
    id: 'cell-ts-fundamentals',
    title: 'Tipos Fundamentales',
    atomIds: [
      'atom-ts-types',
      'atom-ts-quiz',
      'atom-ts-intro-video',
      'atom-ts-basics-task',
    ],
  },
  'cell-ts-advanced': {
    id: 'cell-ts-advanced',
    title: 'Tipos Avanzados y Patterns',
    atomIds: [
      'atom-ts-playbook',
      'atom-ts-advanced-quiz',
      'atom-ts-generics-flashcards',
      'atom-ts-final-task',
    ],
  },
}

export const mockTracks: Track[] = [
  {
    id: 'track-react-hooks',
    title: 'React Hooks Mastery',
    description:
      'Master React Hooks from fundamentals to advanced patterns. Learn useState, useEffect, useContext, useReducer, and custom hooks through hands-on exercises and real-world examples.',
    creatorName: 'Sarah Chen',
    creatorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    language: 'en',
    visibility: 'public',
    cellIds: [
      'cell-hooks-fundamentals',
      'cell-hooks-advanced',
      'cell-hooks-patterns',
    ],
    totalAtoms: 12,
    estimatedMinutes: 145,
    completions: 3842,
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'track-typescript',
    title: 'TypeScript para Frontend',
    description:
      'Domina TypeScript desde los tipos fundamentales hasta patrones avanzados como genéricos, tipos condicionales y utility types. Diseñado para desarrolladores frontend que quieren escribir código más seguro y mantenible.',
    creatorName: 'Carlos Ruiz',
    creatorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRuiz',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    language: 'es',
    visibility: 'public',
    cellIds: [
      'cell-ts-fundamentals',
      'cell-ts-advanced',
    ],
    totalAtoms: 8,
    estimatedMinutes: 98,
    completions: 2156,
    createdAt: '2024-03-05T00:00:00Z',
  },
]
