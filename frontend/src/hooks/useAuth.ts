import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../stores/authStore'
import type { LoginPayload, RegisterPayload } from '../types/auth.types'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      queryClient.clear()
      setAuth(data.data.token, data.data.user)
      navigate('/dashboard')
    },
    onError: () => {
      toast.error('Invalid credentials')
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      queryClient.clear()
      setAuth(data.data.token, data.data.user)
      navigate('/dashboard')
    },
    onError: () => {
      toast.error('Registration failed. Please try again.')
    },
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear()
      clearAuth()
      navigate('/login')
    },
    onError: () => {
      queryClient.clear()
      clearAuth()
      navigate('/login')
    },
  })
}
