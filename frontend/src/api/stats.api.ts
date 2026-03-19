import api from './axios'
import type { StatsData } from '../types/api.types'

export const statsApi = {
  getStats: () =>
    api.get<{ data: StatsData }>('/api/v1/stats').then((r) => r.data.data),
}
