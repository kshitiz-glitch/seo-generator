import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore' // your Zustand store

export default function RequireAuth({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
