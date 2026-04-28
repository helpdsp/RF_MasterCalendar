import * as Tabs from '@radix-ui/react-tabs'
import type { AtomType } from '@/lib/types'

interface TabDef { key: string; label: string; disabled?: boolean }

const TAB_CONFIG: Record<AtomType, TabDef[]> = {
  playbook:  [{ key: 'content', label: 'Content' }, { key: 'takeaways', label: 'Key Takeaways' }],
  quiz:      [{ key: 'questions', label: 'Questions' }, { key: 'results', label: 'Results', disabled: true }, { key: 'review', label: 'Review', disabled: true }],
  flashcard: [{ key: 'cards', label: 'Cards' }, { key: 'terms', label: 'Terms List' }],
  video:     [{ key: 'player', label: 'Player' }, { key: 'notes', label: 'Notes' }],
  task:      [{ key: 'instructions', label: 'Instructions' }, { key: 'checklist', label: 'Checklist' }],
}

interface AtomTabsProps {
  atomType: AtomType
  // In Sprint 4 these will be real players; for now accept ReactNode per tab key
  tabContent?: Partial<Record<string, React.ReactNode>>
  // Callback to unlock tabs (used by quiz to unlock results/review)
  onUnlockTab?: (key: string) => void
  unlockedTabs?: Set<string>
  onCanCompleteChange?: (can: boolean) => void
}

export default function AtomTabs({ atomType, tabContent = {}, unlockedTabs = new Set() }: AtomTabsProps) {
  const tabs = TAB_CONFIG[atomType] ?? [{ key: 'content', label: 'Content' }]
  const firstTab = tabs[0].key

  return (
    <Tabs.Root defaultValue={firstTab} style={{ flex: 1 }}>
      <Tabs.List style={{
        display: 'flex', gap: '4px',
        padding: '4px',
        background: 'var(--surface-container-low)',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => {
          const isDisabled = tab.disabled && !unlockedTabs.has(tab.key)
          return (
            <Tabs.Trigger
              key={tab.key}
              value={tab.key}
              disabled={isDisabled}
              style={{
                padding: '6px 16px',
                borderRadius: '7px',
                border: 'none', cursor: isDisabled ? 'not-allowed' : 'pointer',
                background: 'transparent',
                color: 'var(--foreground)',
                opacity: isDisabled ? 0.3 : 0.65,
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem', fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'all 150ms',
              }}
              // Active styles via data attribute — use CSS
            >
              {tab.label}
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
      <style>{`
        [data-radix-tabs-trigger][data-state="active"] {
          background: var(--surface-bright) !important;
          color: var(--primary) !important;
          opacity: 1 !important;
          font-weight: 600 !important;
        }
      `}</style>

      {tabs.map(tab => (
        <Tabs.Content key={tab.key} value={tab.key} style={{ outline: 'none' }}>
          {tabContent[tab.key] ?? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--foreground)', opacity: 0.4, fontSize: '0.9rem' }}>
              Player coming in Sprint 4
            </div>
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
