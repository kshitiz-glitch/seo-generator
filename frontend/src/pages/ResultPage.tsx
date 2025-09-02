import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface StatusResponse {
  status: 'pending' | 'done' | 'error'
  title?: string
  meta_description?: string
  pdf_url?: string
  docx_url?: string
  error_message?: string
}

export default function ResultPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const queryClient = useQueryClient()

  const seoQuery = useQuery<StatusResponse>({
    queryKey: ['seo-result', jobId],
    queryFn: async () => {
      const res = await axios.get<StatusResponse>(`/api/v1/status/${jobId}`)
      return res.data
    },
    enabled: !!jobId,
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' ? 2000 : false,
  })

  const { data, isLoading, error } = seoQuery
   useEffect(() => {
    if (data?.status === 'done') {
      queryClient.invalidateQueries({ queryKey: ['seo-history'] })
    }
  }, [data?.status, queryClient])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <p className="text-center text-lg">Loading...</p>
      </div>
    )
  }

  if (!data || error || data.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-red-400 text-center px-4">
        <div>
          <p className="text-lg">Something went wrong.</p>
          <p>{data?.error_message || error?.message}</p>
        </div>
      </div>
    )
  }

  if (data.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-blue-300 text-lg">
        Generating SEO copy…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">SEO Results</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Title:</h2>
          <p className="text-white">{data.title}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Meta Description:</h2>
          <p className="text-white">{data.meta_description}</p>
        </div>

        <div className="space-x-4">
          {data.pdf_url && (
            <a
              href={data.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </a>
          )}
          {data.docx_url && (
            <a
              href={data.docx_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download DOCX
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
