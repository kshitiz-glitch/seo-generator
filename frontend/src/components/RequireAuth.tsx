// src/components/RequireAuth.tsx

import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const location = useLocation()

  // If not logged in, redirect to login page and preserve the location
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If authenticated, render protected content
  return <>{children}</>
}
