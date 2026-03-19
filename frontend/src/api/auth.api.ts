import api from './axios'
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types'
import type { User } from '../types/auth.types'

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/api/v1/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/api/v1/auth/login', payload).then((r) => r.data),

  logout: () => api.post('/api/v1/auth/logout'),

  getUser: () => api.get<{ data: User }>('/api/v1/auth/user').then((r) => r.data.data),
}
