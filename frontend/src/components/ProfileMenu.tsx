import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'

export default function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { token, logout } = useAuthStore()
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  if (!token) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Log In
          </motion.button>
        </Link>
        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-black hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            Sign Up
          </motion.button>
        </Link>
      </div>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center transition-all hover:border-cyan-400"
      >
        <span className="text-lg">👤</span>

        {/* Online indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute right-0 top-full mt-2 w-56 glass-panel p-2 rounded-xl overflow-hidden"
          >
            {/* User Info */}
            <div className="px-3 py-3 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-black font-bold">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-white">User</p>
                  <p className="text-xs text-gray-400">Active Session</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/history"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                <span>View History</span>
              </Link>

              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">⚡</span>
                <span>New Generation</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-gray-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
