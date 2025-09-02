import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface SEOJob {
  id: string
  title: string
  meta_description: string
  pdf_url: string
  docx_url: string
  created_at: string
}

export function useHistory() {
  return useQuery<SEOJob[]>({
    queryKey: ['seo-history'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/v1/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("📘 /history response:", res.data)
      return res.data
    },
  })
}
