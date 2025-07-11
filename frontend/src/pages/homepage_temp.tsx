// src/pages/HomePage.tsx
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { useGenerateSeo } from '../hooks/useGenerateSeo'

type FormValues = {
  file?: FileList
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
      language: 'en',
      tone: 'Professional',
      length: 60,
    },
  })

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: (res) => {
        navigate(`/job/${res.jobId}`)
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
    <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6"
        >
          {/* Tabs */}
          <div className="flex space-x-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg transition ${
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
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                      '.docx',
                    ],
                  },
                  onDrop: (files) => field.onChange(files),
                })
                return (
                  <div>
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed p-6 text-center cursor-pointer hover:border-blue-500 rounded-lg"
                    >
                      <input {...getInputProps()} />
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
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
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
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  {/* add more languages */}
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
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  {...field}
                  max={60}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>
            )}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting || isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isPending ? 'Generating…' : 'Generate SEO Copy'}
          </button>
        </form>
      </main>
    </div>
  )
}
