import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProfileMenu from './ProfileMenu'

export default function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home', icon: '⌂' },
    { to: '/app', label: 'Generator', icon: '⚡' },
    { to: '/history', label: 'History', icon: '◷' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'py-3 glass-panel border-b border-white/5'
          : 'py-5 bg-transparent'
        }`}
      style={{
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
          >
            <span className="text-xl font-bold text-black">S</span>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-bold glow-text tracking-tight">SEO.AI</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Generator</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-5 py-2.5 rounded-xl transition-all duration-300"
            >
              {/* Background glow on hover/active */}
              {(isActive(link.to) || hoveredLink === link.to) && (
                <motion.div
                  layoutId="navBackground"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: isActive(link.to)
                      ? 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(180,0,255,0.15))'
                      : 'rgba(255,255,255,0.05)',
                    boxShadow: isActive(link.to)
                      ? '0 0 20px rgba(0,240,255,0.2)'
                      : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <span className={`relative z-10 flex items-center gap-2 text-sm font-medium transition-colors ${isActive(link.to)
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-white'
                }`}>
                <span className="text-base">{link.icon}</span>
                {link.label}
              </span>

              {/* Active indicator line */}
              {isActive(link.to) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side - Profile & Actions */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-400">System Online</span>
          </div>

          {/* Profile Menu */}
          <ProfileMenu />
        </div>
      </div>

      {/* Animated border line at bottom */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          />
        </div>
      )}
    </motion.header>
  )
}