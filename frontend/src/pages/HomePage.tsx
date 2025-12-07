import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGenerateSeo } from '../hooks/useGenerateSeo'

type FormValues = {
  file?: File[]
  url?: string
  language: string
  tone: string
  length: number
}

const TABS = ['Upload File', 'Enter URL'] as const

// Floating Particles for background
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 3,
  }))

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// Circular Progress Indicator
const CircularProgress = ({ progress }: { progress: number }) => (
  <div className="relative w-16 h-16">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="transparent"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="3"
      />
      <motion.circle
        cx="18"
        cy="18"
        r="16"
        fill="transparent"
        stroke="url(#progressGradient)"
        strokeWidth="3"
        strokeDasharray={100}
        strokeDashoffset={100 - progress}
        strokeLinecap="round"
        initial={{ strokeDashoffset: 100 }}
        animate={{ strokeDashoffset: 100 - progress }}
        transition={{ duration: 0.5 }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#b400ff" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-sm font-bold text-cyan-400">{Math.round(progress)}%</span>
    </div>
  </div>
)

export default function HomePage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useGenerateSeo()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>(TABS[0])
  const [progress, setProgress] = useState(0)

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      file: [],
      url: '',
      language: 'en',
      tone: 'Professional',
      length: 60,
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log('🔥 onSubmit triggered with:', data)

    // Simulate progress for visual effect
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 300)

    const formData = new FormData()

    if (activeTab === 'Upload File' && data.file?.length) {
      formData.append('file', data.file[0])
    } else if (activeTab === 'Enter URL' && data.url) {
      formData.append('url', data.url)
    }

    formData.append('language', data.language)
    formData.append('tone', data.tone)
    formData.append('length', String(data.length))

    mutate(formData, {
      onSuccess: (res) => {
        clearInterval(interval)
        setProgress(100)
        console.log('✅ Mutation success, jobId:', res.jobId)
        setTimeout(() => navigate(`/job/${res.jobId}`), 500)
      },
      onError: (err) => {
        clearInterval(interval)
        setProgress(0)
        console.error('❌ Mutation failed:', err)
      },
    })
  }

  const fileList = watch('file')
  const urlValue = watch('url')
  const isValid =
    activeTab === 'Upload File'
      ? Boolean(fileList?.length)
      : typeof urlValue === 'string' && urlValue.startsWith('http')

  return (
    <div className="min-h-screen w-full pt-24 pb-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="cyber-bg" />
      <FloatingParticles />

      {/* Hexagon Grid */}
      <div className="hex-grid opacity-5" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text">SEO Metadata</span> Generator
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload a document or enter a URL to generate AI-powered SEO titles and descriptions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 space-y-8">
              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 rounded-xl bg-black/30">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === tab
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {tab === 'Upload File' ? '📄' : '🔗'} {tab}
                    </span>
                  </button>
                ))}
              </div>

              {/* Upload File Tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'Upload File' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Controller
                      name="file"
                      control={control}
                      rules={{ validate: (v) => (v && v.length > 0 ? true : 'Please upload a PDF or DOCX') }}
                      render={({ field, fieldState }) => {
                        const { getRootProps, getInputProps, isDragActive } = useDropzone({
                          multiple: false,
                          accept: {
                            'application/pdf': ['.pdf'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                          },
                          onDrop: (files) => field.onChange(files),
                        })
                        return (
                          <div>
                            <div
                              {...getRootProps()}
                              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden group ${isDragActive
                                  ? 'border-cyan-500 bg-cyan-500/10'
                                  : field.value?.length
                                    ? 'border-green-500/50 bg-green-500/5'
                                    : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5'
                                }`}
                            >
                              {/* Animated scan line on hover */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.div
                                  animate={{ top: ['0%', '100%'] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                                />
                              </div>

                              <input {...getInputProps()} />

                              <motion.div
                                animate={{ y: isDragActive ? -5 : 0 }}
                                className="text-6xl mb-4"
                              >
                                {field.value?.length ? '✅' : isDragActive ? '📥' : '📄'}
                              </motion.div>

                              <p className="text-lg font-medium text-white mb-2">
                                {field.value?.length
                                  ? field.value[0].name
                                  : isDragActive
                                    ? 'Drop your file here...'
                                    : 'Drag & drop a PDF/DOCX here'}
                              </p>
                              <p className="text-sm text-gray-500">
                                or click to browse files
                              </p>
                            </div>

                            {fieldState.error && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mt-2 flex items-center gap-1"
                              >
                                ⚠️ {fieldState.error.message}
                              </motion.p>
                            )}
                          </div>
                        )
                      }}
                    />
                  </motion.div>
                )}

                {/* Enter URL Tab */}
                {activeTab === 'Enter URL' && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Controller
                      name="url"
                      control={control}
                      rules={{
                        required: 'Please enter a URL',
                        pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Website URL</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500">🔗</span>
                            <input
                              type="url"
                              {...field}
                              placeholder="https://example.com/article"
                              className="cyber-input pl-12"
                            />
                          </div>
                          {fieldState.error && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-red-400 text-sm flex items-center gap-1"
                            >
                              ⚠️ {fieldState.error.message}
                            </motion.p>
                          )}
                        </div>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Language */}
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        🌐 Language
                      </label>
                      <select {...field} className="cyber-select">
                        <option value="en">🇺🇸 English</option>
                        <option value="fr">🇫🇷 French</option>
                        <option value="de">🇩🇪 German</option>
                        <option value="es">🇪🇸 Spanish</option>
                        <option value="it">🇮🇹 Italian</option>
                        <option value="pt">🇵🇹 Portuguese</option>
                        <option value="ja">🇯🇵 Japanese</option>
                        <option value="ko">🇰🇷 Korean</option>
                        <option value="zh">🇨🇳 Chinese</option>
                        <option value="hi">🇮🇳 Hindi</option>
                      </select>
                    </div>
                  )}
                />

                {/* Tone */}
                <Controller
                  name="tone"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        🎭 Tone
                      </label>
                      <select {...field} className="cyber-select">
                        <option>Professional</option>
                        <option>Friendly</option>
                        <option>Urgent</option>
                        <option>Casual</option>
                        <option>Formal</option>
                        <option>Exciting</option>
                      </select>
                    </div>
                  )}
                />

                {/* Length */}
                <Controller
                  name="length"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        📏 Max Length
                      </label>
                      <input
                        type="number"
                        max={60}
                        min={30}
                        {...field}
                        className="cyber-input"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!isValid || isSubmitting || isPending}
                whileHover={{ scale: isValid ? 1.02 : 1 }}
                whileTap={{ scale: isValid ? 0.98 : 1 }}
                className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${isValid
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black hover:shadow-lg hover:shadow-cyan-500/30'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {/* Animated shine effect */}
                {isValid && !isPending && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <div className="cyber-loader w-6 h-6" />
                      Generating...
                    </>
                  ) : (
                    <>
                      ⚡ Generate SEO Copy
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Side Panel - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Progress Card (when generating) */}
            <AnimatePresence>
              {isPending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-6 text-center"
                >
                  <CircularProgress progress={progress} />
                  <h3 className="text-lg font-bold mt-4 text-white">Processing...</h3>
                  <p className="text-sm text-gray-400 mt-2">AI is analyzing your content</p>

                  <div className="mt-4 space-y-2 text-left">
                    {['Extracting content', 'Analyzing keywords', 'Generating SEO'].map((step, i) => (
                      <div key={step} className="flex items-center gap-2 text-sm">
                        <motion.span
                          animate={{ opacity: progress > (i + 1) * 30 ? 1 : 0.3 }}
                          className={progress > (i + 1) * 30 ? 'text-green-400' : 'text-gray-500'}
                        >
                          {progress > (i + 1) * 30 ? '✓' : '○'}
                        </motion.span>
                        <span className={progress > (i + 1) * 30 ? 'text-white' : 'text-gray-500'}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Features Card */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                ✨ Features
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: '🤖', text: 'AI-Powered Analysis' },
                  { icon: '🌐', text: '50+ Languages Support' },
                  { icon: '📊', text: 'SEO Score Optimization' },
                  { icon: '📥', text: 'Export to PDF/DOCX' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="text-lg">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Card */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                💡 Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">→</span>
                  Use PDFs with clear text for best results
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">→</span>
                  Article URLs work better than home pages
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">→</span>
                  Optimal title length is 50-60 characters
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}