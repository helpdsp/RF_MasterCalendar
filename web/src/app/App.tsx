import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { MockDataProvider } from '@/app/providers/MockDataProvider'
import { router } from './routes'

export default function App() {
  return (
    <ThemeProvider>
      <MockDataProvider>
        <RouterProvider router={router} />
      </MockDataProvider>
    </ThemeProvider>
  )
}
