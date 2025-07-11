// src/store/authStore.ts
import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  login: (token) => set({ isLoggedIn: true, token }),
  logout: () => set({ isLoggedIn: false, token: null }),
}))

export default useAuthStore
