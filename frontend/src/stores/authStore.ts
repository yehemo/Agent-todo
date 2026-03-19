import { create } from 'zustand'
import type { User } from '../types/auth.types'

const STORAGE_KEY = 'auth-storage'

interface StoredAuth {
  token: string
  user: User
}

function readStoredAuth(): StoredAuth | null {
  // Prefer localStorage (remember me), fall back to sessionStorage (session only)
  const raw =
    localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

function writeAuth(token: string, user: User, rememberMe: boolean): void {
  const payload = JSON.stringify({ token, user })
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEY, payload)
    sessionStorage.removeItem(STORAGE_KEY)
  } else {
    sessionStorage.setItem(STORAGE_KEY, payload)
    localStorage.removeItem(STORAGE_KEY)
  }
}

function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

const stored = readStoredAuth()

interface AuthStore {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User, rememberMe: boolean) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  token: stored?.token ?? null,
  user: stored?.user ?? null,

  setAuth: (token, user, rememberMe) => {
    writeAuth(token, user, rememberMe)
    set({ token, user })
  },

  clearAuth: () => {
    clearStoredAuth()
    set({ token: null, user: null })
  },

  isAuthenticated: () => !!get().token,
}))
