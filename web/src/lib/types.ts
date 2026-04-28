export type AtomType = "video" | "quiz" | "flashcard" | "playbook" | "task";
export type SkinType = "velocity_dark" | "velocity_pro";

export interface VideoNote { timestampSeconds: number; text: string; }
export interface VideoContent { url: string; durationSeconds: number; thumbnailUrl: string; notes: VideoNote[]; }

export interface QuizQuestion { id: string; text: string; options: [string, string, string, string]; correctIndex: number; reviewHint: string; }
export interface QuizContent { passingScore: number; questions: QuizQuestion[]; }

export interface FlashcardItem { id: string; front: string; back: string; }
export interface FlashcardContent { cards: FlashcardItem[]; }

export interface PlaybookContent { markdown: string; estimatedReadMinutes: number; keyTakeaways: string[]; }

export interface TaskCheckItem { id: string; label: string; }
export interface TaskContent { instructionsHtml: string; checklistItems: TaskCheckItem[]; referenceImageUrl: string | null; }

export interface Atom {
  id: string;
  title: string;
  type: AtomType;
  estimatedMinutes: number;
  content: VideoContent | QuizContent | FlashcardContent | PlaybookContent | TaskContent;
}

export interface Cell { id: string; title: string; atomIds: string[]; }

export interface Track {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  creatorAvatarUrl: string;
  thumbnailUrl: string;
  language: "en" | "es";
  visibility: "public";
  cellIds: string[];
  totalAtoms: number;
  estimatedMinutes: number;
  completions: number;
  createdAt: string;
}

export interface MockUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  level: number;
  role: "learner";
  skinPreference: SkinType;
  createdAt: string;
}

export interface AtomProgress {
  atomId: string;
  status: "not_started" | "in_progress" | "completed";
  completedAt: string | null;
  score: number | null;
}

export interface UserStreak { currentStreak: number; maxStreak: number; lastActivityDate: string; }

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  atomsCompleted: number;
  currentStreak: number;
  change: number;
  isCurrentUser: boolean;
}

export interface UserStats {
  atomsCompleted: number;
  atomsThisWeek: number;
  totalMinutes: number;
  weeklyActivity: Record<string, number>; // ISO date → atoms count
}

export interface MockState {
  user: MockUser;
  tracks: Track[];
  cells: Record<string, Cell>;
  atoms: Record<string, Atom>;
  progress: Record<string, AtomProgress>;
  streak: UserStreak;
  stats: UserStats;
  leaderboard: LeaderboardEntry[];
  lastCompletedAtomId: string | null;
}
