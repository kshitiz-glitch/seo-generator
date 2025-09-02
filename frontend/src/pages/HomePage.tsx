import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { useGenerateSeo } from '../hooks/useGenerateSeo'

type FormValues = {
  file?: File[]
  url?: string
  language: string
  tone: string
  length: number
}

const TABS = ['Upload File', 'Enter URL'] as const

export default function HomePage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useGenerateSeo()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>(TABS[0])

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
      onSuccess: (res) => 
         {
      console.log('✅ Mutation success, jobId:', res.jobId)
      navigate(`/job/${res.jobId}`)
    },
    onError: (err) => {
      console.error('❌ Mutation failed:', err)}
    })
  }

  const fileList = watch('file')
  const urlValue = watch('url')
  const isValid =
    activeTab === 'Upload File'
      ? Boolean(fileList?.length)
      : typeof urlValue === 'string' && urlValue.startsWith('http')

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br  from-purple-900 to-indigo-900 flex flex-col">

      <main className="flex-grow flex items-center justify-center p-6 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 w-full max-w-lg space-y-8 transition-transform hover:scale-[1.01]"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Generate SEO Metadata Instantly
          </h1>

          {/* Tabs */}
          <div className="flex space-x-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Upload File */}
          {activeTab === 'Upload File' && (
            <Controller
              name="file"
              control={control}
              rules={{
                validate: (v) =>
                  v && v.length > 0 ? true : 'Please upload a PDF or DOCX',
              }}
              render={({ field, fieldState }) => {
                const { getRootProps, getInputProps } = useDropzone({
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
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-8 text-center cursor-pointer hover:border-blue-500 rounded-xl transition"
                    >
                      <input {...getInputProps()} />
                      <div className="text-4xl mb-2 text-blue-500">📄</div>
                      {field.value?.length
                        ? field.value[0].name
                        : 'Drag & drop a PDF/DOCX here, or click to select'}
                    </div>
                    {fieldState.error && (
                      <p className="text-red-500 mt-1 text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )
              }}
            />
          )}

          {/* Enter URL */}
          {activeTab === 'Enter URL' && (
            <Controller
              name="url"
              control={control}
              rules={{
                required: 'Please enter a URL',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Must be a valid URL',
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <input
                    type="url"
                    {...field}
                    placeholder="https://example.com/article"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none p-2"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 mt-1 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          )}

          {/* Language */}
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Language
                </label>
                <select
                  {...field}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  
                  
                  <option value="en">🇺🇸 English</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  
                  <option value="it">🇮🇹 Italian</option>
                  
                  
                  
                  <option value="es">🇪🇸 Spanish</option>
                </select>
              </div>
            )}
          />

          {/* Tone */}
          <Controller
            name="tone"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Tone
                </label>
                <select
                  {...field}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Urgent</option>
                </select>
              </div>
            )}
          />

          {/* Length */}
          <Controller
            name="length"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Title Length (max 60)
                </label>
                <input
                  type="number"
                  max={60}
                  {...field}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none p-2"
                />
              </div>
            )}
          />

          {/* Progress Bar */}
          {isPending && (
            <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse w-2/3"></div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting || isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-transform hover:scale-[1.01]"
          >
            {isPending ? 'Generating…' : 'Generate SEO Copy'}
          </button>
        </form>
      </main>
    </div>
  )
}

{/* uvicorn app.main:app --reload */}