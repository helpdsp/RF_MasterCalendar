import AtomTopBar from './AtomTopBar'
import AtomHeader from './AtomHeader'
import AtomTabs from './AtomTabs'
import AtomBottomBar from './AtomBottomBar'
import type { Atom } from '@/lib/types'

interface AtomPageLayoutProps {
  trackId: string
  atomId: string
  atom: Atom
  canComplete?: boolean
  score?: number
  tabContent?: Partial<Record<string, React.ReactNode>>
  unlockedTabs?: Set<string>
}

export default function AtomPageLayout({ trackId, atomId, atom, canComplete = false, score, tabContent, unlockedTabs }: AtomPageLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AtomTopBar trackId={trackId} atomId={atomId} />

      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        maxWidth: 800, width: '100%',
        margin: '0 auto', padding: '0 1.5rem',
      }}>
        <AtomHeader atom={atom} />
        <AtomTabs atomType={atom.type} tabContent={tabContent} unlockedTabs={unlockedTabs} />
      </main>

      <AtomBottomBar trackId={trackId} atomId={atomId} canComplete={canComplete} score={score} />
    </div>
  )
}
