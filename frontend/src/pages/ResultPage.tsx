import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

type JobStatus = {
  status: 'completed' | 'processing' | 'error'
  title?: string
  meta_description?: string
  pdf_url?: string
  docx_url?: string
  error_message?: string
}

export default function ResultPage() {
  const { jobId } = useParams()
  const [result, setResult] = useState<JobStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<'title' | 'meta' | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.status(jobId!))
        const data = await res.json()
        setResult(data)
      } catch (err) {
        setResult({ status: 'error', error_message: 'Failed to fetch result' })
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [jobId])

  const copyToClipboard = (text: string, type: 'title' | 'meta') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

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
          <h2 className="text-xl font-bold text-white">Processing Your Request</h2>
          <p className="text-gray-400 mt-2">AI is analyzing your content...</p>
        </motion.div>
      </div>
    )
  }

  if (result?.status === 'error') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 relative">
        <div className="cyber-bg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-2xl text-center max-w-md"
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-white">Generation Failed</h2>
          <p className="text-red-400 mt-2">{result.error_message}</p>
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-6 cyber-btn"
            >
              Try Again
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="cyber-bg" />

      {/* Floating Particles */}
      <div className="particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center"
          >
            <span className="text-4xl">✓</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="glow-text">SEO Generated Successfully!</span>
          </h1>
          <p className="text-gray-400">Your optimized metadata is ready to use</p>
        </motion.div>

        {/* Results Cards */}
        <div className="space-y-6">
          {/* Title Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-xl group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                📝 SEO Title
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(result?.title || '', 'title')}
                className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all flex items-center gap-2"
              >
                {copied === 'title' ? '✓ Copied!' : '📋 Copy'}
              </motion.button>
            </div>
            <p className="text-xl text-white font-medium leading-relaxed">
              {result?.title}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span>{result?.title?.length || 0} characters</span>
              <span className={`px-2 py-0.5 rounded text-xs ${(result?.title?.length || 0) <= 60
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                {(result?.title?.length || 0) <= 60 ? '✓ Optimal' : '⚠ Too long'}
              </span>
            </div>
          </motion.div>

          {/* Meta Description Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-xl group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                📄 Meta Description
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(result?.meta_description || '', 'meta')}
                className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all flex items-center gap-2"
              >
                {copied === 'meta' ? '✓ Copied!' : '📋 Copy'}
              </motion.button>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              {result?.meta_description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span>{result?.meta_description?.length || 0} characters</span>
              <span className={`px-2 py-0.5 rounded text-xs ${(result?.meta_description?.length || 0) <= 160
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                {(result?.meta_description?.length || 0) <= 160 ? '✓ Optimal' : '⚠ Too long'}
              </span>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              🔍 Google Search Preview
            </h3>
            <div className="bg-white rounded-lg p-4">
              <div className="text-blue-700 text-lg font-medium hover:underline cursor-pointer truncate">
                {result?.title}
              </div>
              <div className="text-green-700 text-sm mt-1">
                https://example.com/your-article
              </div>
              <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                {result?.meta_description}
              </div>
            </div>
          </motion.div>

          {/* Download Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {result?.pdf_url && (
              <a href={result.pdf_url} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  📥 Download PDF
                </motion.button>
              </a>
            )}
            {result?.docx_url && (
              <a href={result.docx_url} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  📄 Download DOCX
                </motion.button>
              </a>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4 pt-8"
          >
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="cyber-btn-outline"
              >
                ⚡ Generate Another
              </motion.button>
            </Link>
            <Link to="/history">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                📊 View History
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
