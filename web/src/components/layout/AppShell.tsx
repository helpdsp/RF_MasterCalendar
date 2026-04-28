import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* Desktop sidebar - lg and above */}
      <div className="hidden lg:flex">
        <Sidebar />
        <main className="flex-1 max-w-[1400px] mx-auto px-8 py-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 px-4 py-4 pb-20 max-w-[600px] mx-auto w-full">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
