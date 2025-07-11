import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import useThemeStore from './store/themeStore'

// Import React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Instantiate a client
const queryClient = new QueryClient()

const Root = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const defaultTheme = saved
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    setTheme(defaultTheme)
  }, [setTheme])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    // 2. Wrap your application in the provider
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Root />
)

