import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout } from '../hooks/useAuth'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function ProfileMenu() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button with full-size Lottie */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 rounded-full overflow-hidden bg-transparent"
      >
        <div className="absolute inset-0 scale-[1.7]">
          <DotLottieReact
            src="https://lottie.host/5d6f3eea-2971-4bda-b353-a0d5243a3e06/u1DHl5BcsU.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 shadow-lg rounded py-1 z-50">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
