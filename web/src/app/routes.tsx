import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TracksPage = lazy(() => import('@/pages/TracksPage'))
const TrackOverviewPage = lazy(() => import('@/pages/TrackOverviewPage'))
const AtomPage = lazy(() => import('@/pages/AtomPage'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', color: 'var(--foreground)', opacity: 0.4,
      fontFamily: "'Inter', sans-serif", fontSize: '0.875rem',
    }}>
      Loading…
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
      { path: 'tracks', element: <Suspense fallback={<PageLoader />}><TracksPage /></Suspense> },
      { path: 'tracks/:trackId', element: <Suspense fallback={<PageLoader />}><TrackOverviewPage /></Suspense> },
      { path: 'tracks/:trackId/atoms/:atomId', element: <Suspense fallback={<PageLoader />}><AtomPage /></Suspense> },
    ],
  },
])
