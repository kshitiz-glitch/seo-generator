import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface GenerateResponse {
  jobId: string
  // or title/meta/pdf_url/docx_url if doing inline
}

interface FormValues {
  file?: FileList
  url?: string
  language: string
  tone: string
  length: number
}

export function useGenerateSeo() {
  return useMutation<GenerateResponse, Error, FormValues>(async (values) => {
    // decide between JSON vs FormData
    if (values.file) {
      const form = new FormData()
      form.append('file', values.file[0])
      form.append('language', values.language)
      form.append('tone', values.tone)
      form.append('length', String(values.length))
      const { data } = await axios.post<GenerateResponse>('/api/v1/generate-seo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } else {
      const { data } = await axios.post<GenerateResponse>(
        '/api/v1/generate-seo',
        {
          url: values.url,
          language: values.language,
          tone: values.tone,
          length: values.length,
        }
      )
      return data
    }
  })
}
