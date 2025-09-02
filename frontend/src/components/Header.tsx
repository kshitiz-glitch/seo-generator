import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import ProfileMenu from './ProfileMenu'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between transition-all duration-300
      ${isScrolled ? 'bg-black/80 shadow-md backdrop-blur-md' : 'bg-transparent text-white'}`}
    >
      {/* Logo and Title */}
      <Link to="/app" className="flex items-center space-x-3">
        <img src={Logo} alt="SEO Gen Logo" className="h-12 w-auto" />
        <span className="text-2xl font-bold text-white">News SEO</span>
      </Link>

      {/* Navigation and Profile */}
      <div className="flex items-center space-x-6">
        <nav className="flex items-center space-x-6 text-white text-lg">
          <Link
            to="/app"
            className={`px-3 py-1 rounded ${
              loc.pathname === '/app' ? 'bg-white text-black' : 'hover:underline text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1 rounded ${
              loc.pathname === '/history' ? 'bg-white text-black' : 'hover:underline text-white'
            }`}
          >
            History
          </Link>
        </nav>

        {/* Profile menu pushed slightly apart */}
        <div className="ml-4">
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}