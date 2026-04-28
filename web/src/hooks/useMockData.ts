import { useMockDataContext } from '@/app/providers/MockDataProvider'

/**
 * Returns the full mock data state and dispatch function from MockDataContext.
 * Must be used inside a MockDataProvider.
 */
export function useMockData() {
  return useMockDataContext()
}
