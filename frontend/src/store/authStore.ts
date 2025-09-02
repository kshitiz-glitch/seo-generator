// src/store/authStore.ts
import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem('token')
  return {
    token: savedToken,
    isLoggedIn: !!savedToken,
    login: (token: string) => {
      localStorage.setItem('token', token)
      set({ token, isLoggedIn: true })
    },
    logout: () => {
      localStorage.removeItem('token')
      set({ token: null, isLoggedIn: false })
    },
  }
})

export default useAuthStore
