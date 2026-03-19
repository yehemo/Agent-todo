import { useQuery } from '@tanstack/react-query'
import { statsApi } from '../api/stats.api'
import { queryKeys } from '../utils/queryKeys'

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: statsApi.getStats,
  })
}
