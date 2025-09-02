// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import useAuthStore from '../store/authStore'

interface AuthPayload {
  email: string
  password: string
}

interface SignupResponse {
  token: string
}

interface LoginResponse {
  access_token: string
  token_type: string
}

/**
 * Hook to sign up a user.
 * Stores JWT token on success.
 */
export function useSignup() {
  const login = useAuthStore((s) => s.login)
  return useMutation<SignupResponse, Error, AuthPayload>({
    mutationFn: (creds) =>
      axios.post<SignupResponse>('/api/v1/signup', creds).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      login(data.token)
    },
  })
}

/**
 * Hook to log in a user.
 * Stores JWT token on success.
 */
export function useLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation<LoginResponse, Error, AuthPayload>({
    mutationFn: (creds) =>
      axios.post<LoginResponse>('/api/v1/login', creds).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      login(data.access_token)
    },
  })
}

/**
 * Logs out the user by clearing the token.
 */
export function logout() {
  const logoutFunc = useAuthStore.getState().logout
  localStorage.removeItem('token')
  logoutFunc()
  delete axios.defaults.headers.common.Authorization
}
