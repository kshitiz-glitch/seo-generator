import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

interface GenerateResponse {
  jobId: string
}

export function useGenerateSeo(): UseMutationResult<GenerateResponse, Error, FormData> {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<GenerateResponse> => {
      const token = localStorage.getItem('token')
      console.log('🚀 Sending form data to backend')

      const { data } = await axios.post<GenerateResponse>(
        API_ENDPOINTS.generateSeo,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        }
      )
      return data
    },
  })
}

