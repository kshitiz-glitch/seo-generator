import { useHistory } from '../hooks/useHistory'

export default function HistoryPage() {
  const { data, isLoading, error } = useHistory()

  if (isLoading) return <p className="p-8 text-white bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">Loading history...</p>
  if (error) return <p className="p-8 text-red-500 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">Error loading history</p>
  if (!data || data.length === 0)
    return <p className="p-8 text-white bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen ">No history found.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Your SEO History</h1>
        <ul className="space-y-4">
          {data.map((job) => (
            <li
              key={job.id}
              className="group border border-white/20 rounded-lg p-4 shadow bg-white text-black dark:bg-gray-800 dark:text-white transition duration-300 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {/* Hover-only timestamp */}
              <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition duration-300 mb-1">
                🕒 Generated on {new Date(job.created_at).toLocaleDateString()}
              </p>

              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{job.meta_description}</p>
              <div className="space-x-4">
                <a
                  href={job.pdf_url}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download PDF
                </a>
                <a
                  href={job.docx_url}
                  className="text-green-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download DOCX
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}