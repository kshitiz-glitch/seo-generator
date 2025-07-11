// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import useAuthStore from '../store/authStore'

interface AuthPayload {
  email: string
  password: string
}

interface AuthResponse {
  token: string
}

export function useSignup() {
  const login = useAuthStore((s) => s.login)
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: (creds) =>
      axios.post<AuthResponse>('/api/v1/signup', creds).then((res) => res.data),
    onSuccess: (data) => {
      login(data.token)
    },
  })
}

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: (creds) =>
      axios.post<AuthResponse>('/api/v1/login', creds).then((res) => res.data),
    onSuccess: (data) => {
      login(data.token)
    },
  })
}
