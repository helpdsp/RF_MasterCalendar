import { motion } from 'framer-motion'

export type StatusFilter = 'all' | 'in_progress' | 'not_started' | 'completed'
export type LangFilter = 'all' | 'en' | 'es'

interface FilterChipsProps {
  statusFilter: StatusFilter
  langFilter: LangFilter
  onStatusChange: (v: StatusFilter) => void
  onLangChange: (v: LangFilter) => void
}

const STATUS_CHIPS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'completed', label: 'Completed' },
]

const LANG_CHIPS: { value: LangFilter; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
]

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 16px',
        borderRadius: 20,
        border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
        background: active
          ? 'linear-gradient(135deg, var(--primary), var(--primary-dim))'
          : 'var(--surface-bright)',
        color: active ? '#fff' : 'var(--foreground)',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '0.8125rem',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s ease, color 0.15s ease',
        opacity: active ? 1 : 0.75,
      }}
    >
      {label}
    </motion.button>
  )
}

export default function FilterChips({ statusFilter, langFilter, onStatusChange, onLangChange }: FilterChipsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {STATUS_CHIPS.map((chip) => (
        <Chip
          key={chip.value}
          label={chip.label}
          active={statusFilter === chip.value}
          onClick={() => onStatusChange(chip.value)}
        />
      ))}
      <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
      {LANG_CHIPS.map((chip) => (
        <Chip
          key={chip.value}
          label={chip.value === langFilter ? `✓ ${chip.label}` : chip.label}
          active={langFilter === chip.value}
          onClick={() => onLangChange(langFilter === chip.value ? 'all' : chip.value)}
        />
      ))}
    </div>
  )
}
