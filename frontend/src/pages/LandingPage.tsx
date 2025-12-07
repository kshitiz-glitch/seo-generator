import { Link } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 4,
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

// Animated Counter Component
const AnimatedCounter = ({ end, label }: { end: number; label: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold glow-text">{count.toLocaleString()}+</div>
      <div className="text-sm text-gray-400 uppercase tracking-widest mt-2">{label}</div>
    </div>
  )
}

// Service Card with Holographic Effect
const ServiceCard = ({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, rotateX: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.7, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, rotateY: 5 }}
    className="glass-card p-8 relative group cursor-pointer"
    style={{ perspective: '1000px' }}
  >
    {/* Animated border gradient */}
    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Glow effect on hover */}
    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-[22px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

    <div className="relative z-10">
      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>

      {/* Animated data stream */}
      <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
      </div>
    </div>
  </motion.div>
)

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Animated Background */}
      <div className="cyber-bg" />
      <FloatingParticles />

      {/* Scan Line Effect */}
      <div className="scan-line opacity-30" />

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center px-6 md:px-20 pt-24">
        {/* Hexagon Grid Pattern */}
        <div className="hex-grid" />

        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-8 relative z-10"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-cyan-400">AI-Powered System Online</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="block text-white">Elevate Your</span>
              <span
                className="block glitch glow-text"
                data-text="SEO with AI"
                style={{
                  transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
                }}
              >
                SEO with AI
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                — Rank Higher
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
              Welcome to the forefront of AI-powered SEO. Instantly generate optimized
              metadata to <span className="text-cyan-400 font-semibold">supercharge your visibility</span> across
              search engines worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/app">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="cyber-btn ripple text-lg px-10 py-4"
                >
                  <span className="flex items-center gap-2">
                    🚀 Get Started
                  </span>
                </motion.button>
              </Link>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="cyber-btn-outline text-lg px-10 py-4"
                >
                  <span className="flex items-center gap-2">
                    🔐 Log In
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">10K+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Generations</div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">50+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Languages</div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">99%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Lottie Animation with Effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="relative flex justify-center items-center"
            style={{ perspective: '1500px' }}
          >
            {/* Glowing orb behind */}
            <div
              className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(180,0,255,0.3) 50%, transparent 70%)',
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              }}
            />

            {/* Main Animation Container */}
            <div
              className="relative glass-panel p-8 rounded-3xl animate-glow-pulse"
              style={{
                transform: `rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <DotLottieReact
                src="https://lottie.host/6109cada-f6ce-4e56-8599-b2859bd14e3c/XxOUS78S2l.lottie"
                loop
                autoplay
                style={{ height: '400px', width: '400px' }}
              />

              {/* Floating Labels */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-lg glass-panel text-sm text-cyan-400 font-medium"
              >
                ⚡ Real-time AI
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg glass-panel text-sm text-purple-400 font-medium"
              >
                🌐 50+ Languages
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter end={10000} label="SEO Generated" />
          <AnimatedCounter end={500} label="Active Users" />
          <AnimatedCounter end={50} label="Languages" />
          <AnimatedCounter end={99} label="Accuracy %" />
        </div>
      </section>

      {/* ============ SERVICES SECTION ============ */}
      <section className="py-24 px-6 md:px-20 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text">Our Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Powered by cutting-edge AI to deliver SEO content that resonates and ranks
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Service Cards Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <ServiceCard
            icon="🧠"
            title="Headline Architect"
            desc="We craft compelling headlines that capture attention and drive clicks using advanced NLP algorithms."
            index={0}
          />
          <ServiceCard
            icon="🎙️"
            title="Voice Weaver"
            desc="Your SEO content speaks volumes in your unique voice, maintaining brand consistency across all channels."
            index={1}
          />
          <ServiceCard
            icon="🌍"
            title="Global Communicator"
            desc="Break language barriers with multilingual SEO copy, reaching audiences in 50+ languages worldwide."
            index={2}
          />
        </div>
      </section>

      {/* ============ TERMINAL SHOWCASE ============ */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-1 rounded-2xl overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-gray-400 font-mono">seo-generator.ai</span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm space-y-2">
              <div className="text-gray-500">$ seo-generator --analyze</div>
              <div className="text-cyan-400">→ Scanning content...</div>
              <div className="text-purple-400">→ Processing with AI model...</div>
              <div className="text-green-400">✓ SEO Title: "Ultimate Guide to AI-Powered Marketing in 2024"</div>
              <div className="text-green-400">✓ Meta Description: "Discover how AI transforms digital marketing..."</div>
              <div className="flex items-center text-white">
                <span>$</span>
                <span className="typing-cursor" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="glow-text">Transform</span> Your SEO?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of marketers using AI to generate high-converting SEO content in seconds.
          </p>

          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="cyber-btn text-xl px-16 py-5"
            >
              Start Generating Now →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold glow-text">SEO.AI</div>
          <div className="text-gray-500 text-sm">
            © 2024 SEO Generator. Powered by AI.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
