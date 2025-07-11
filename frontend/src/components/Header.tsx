import { Link, useLocation } from 'react-router-dom'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import useThemeStore from '../store/themeStore'

export default function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const loc = useLocation()

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold">SEO Gen</span>
        <nav className="space-x-2">
          <Link
            to="/"
            className={`px-3 py-1 rounded ${
              loc.pathname === '/'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-200 hover:underline'
            }`}
          >
            Home
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1 rounded ${
              loc.pathname === '/history'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-200 hover:underline'
            }`}
          >
            History
          </Link>
        </nav>
      </div>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6 text-gray-800" />
        ) : (
          <SunIcon className="h-6 w-6 text-yellow-300" />
        )}
      </button>
    </header>
  )
}


