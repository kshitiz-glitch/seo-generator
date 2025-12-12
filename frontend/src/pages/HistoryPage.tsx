import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { API_ENDPOINTS } from '../config/api'

type HistoryItem = {
  _id: string
  title: string
  meta_description: string
  pdf_url: string
  docx_url: string
  created_at: string
}

export default function HistoryPage() {
  const { token } = useAuthStore()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.history, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch history')

        const data = await res.json()
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchHistory()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative">
        <div className="cyber-bg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-2xl text-center"
        >
          <div className="cyber-loader mx-auto mb-6" />
          <h2 className="text-xl font-bold text-white">Loading History</h2>
          <p className="text-gray-400 mt-2">Fetching your previous generations...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="cyber-bg" />

      {/* Hex Grid */}
      <div className="hex-grid opacity-5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text">Generation History</span>
          </h1>
          <p className="text-gray-400">View and download your previous SEO generations</p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6 rounded-xl text-center text-red-400 mb-8"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-16 rounded-2xl text-center"
          >
            <div className="text-6xl mb-6">📭</div>
            <h2 className="text-2xl font-bold text-white mb-3">No History Yet</h2>
            <p className="text-gray-400 mb-8">Start generating SEO content to see your history here</p>
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="cyber-btn"
              >
                ⚡ Create Your First Generation
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* History Grid */}
        {history.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl group hover:border-cyan-500/30 transition-all"
              >
                {/* Date Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>

                {/* Meta Description */}
                <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                  {item.meta_description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <span>Title: {item.title.length} chars</span>
                  <span>•</span>
                  <span>Meta: {item.meta_description.length} chars</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium text-center hover:bg-red-500/20 transition-all"
                    >
                      📥 PDF
                    </a>
                  )}
                  {item.docx_url && (
                    <a
                      href={item.docx_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-4 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium text-center hover:bg-blue-500/20 transition-all"
                    >
                      📄 DOCX
                    </a>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(item.title + '\n\n' + item.meta_description)}
                    className="py-2 px-4 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all"
                  >
                    📋
                  </button>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass-panel p-6 rounded-xl"
          >
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold glow-text">{history.length}</div>
                <div className="text-sm text-gray-400">Total Generations</div>
              </div>
              <div className="h-12 w-px bg-gray-700 hidden sm:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">
                  {Math.round(history.reduce((acc, item) => acc + item.title.length, 0) / history.length)}
                </div>
                <div className="text-sm text-gray-400">Avg. Title Length</div>
              </div>
              <div className="h-12 w-px bg-gray-700 hidden sm:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {Math.round(history.reduce((acc, item) => acc + item.meta_description.length, 0) / history.length)}
                </div>
                <div className="text-sm text-gray-400">Avg. Meta Length</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}