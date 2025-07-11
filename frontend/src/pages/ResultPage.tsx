// frontend/src/pages/ResultPage.tsx
import { useParams } from 'react-router-dom'

export default function ResultPage() {
  const { jobId } = useParams<{ jobId: string }>()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Results for Job {jobId}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        (Your generated title & meta will appear here once we wire up the API.)
      </p>
    </div>
  )
}
