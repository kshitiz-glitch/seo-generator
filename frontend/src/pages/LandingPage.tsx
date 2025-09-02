import { Link } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import NavigaLogo from '../assets/navigalogo.svg'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col overflow-x-hidden">

      {/* SECTION 1 - HERO */}
      <section className="w-full min-h-[100vh] px-20 py-32 flex items-center justify-between gap-12">

        {/* LEFT HERO TEXT */}
        <motion.div
          className="flex-1 max-w-2xl space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight">
            Elevate SEO with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              AI
            </span>{' '}
            — Rank higher
          </h1>

          <p className="text-2xl text-gray-300">
            Welcome to the forefront of AI-powered SEO. Instantly generate optimized metadata to supercharge your visibility.
          </p>

          {/* CTA Buttons */}
          <div className="space-x-4 pt-2">
            <Link
              to="/app"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition px-8 py-4 text-lg rounded-full font-semibold shadow-md"
            >
              🚀 Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block border border-white hover:border-pink-300 transition px-8 py-4 text-lg rounded-full font-medium text-white"
            >
              🔐 Log In
            </Link>
          </div>
        </motion.div>

        {/* RIGHT HERO LOTTIE ANIMATION BOX */}
        <motion.div
          className="flex-1 max-w-[720px] bg-black bg-opacity-20 rounded-3xl shadow-2xl p-12 mr-40 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DotLottieReact
            src="https://lottie.host/6109cada-f6ce-4e56-8599-b2859bd14e3c/XxOUS78S2l.lottie"
            loop
            autoplay
            style={{
              height: '500px',
              width: '500px',
              transform: 'scale(1.2)',   // optional: scales entire object
              transformOrigin: 'center',
            }}
          />
        </motion.div>

        {/* POWERED BY LINE */}
        <motion.div
          className="absolute bottom-12 left-[44.5%] transform -translate-x-[64%]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
         
          <img src={NavigaLogo} alt="Naviga" className="w-auto" style={{ height: '60px' }} />
          
        </motion.div>
      </section>

      {/* SECTION 2 - SERVICES */}
      <section className="py-16 px-20 bg-black bg-opacity-20 backdrop-blur-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white">
          🌟 Our Services
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Headline Architect',
              icon: '🧠',
              desc: 'We craft compelling headlines that capture attention.',
            },
            {
              title: 'Voice Weaver',
              icon: '🎙️',
              desc: 'Your SEO content speaks volumes in your unique voice.',
            },
            {
              title: 'Global Communicator',
              icon: '🌍',
              desc: 'Break language barriers with multilingual SEO copy.',
            },
          ].map((svc, index) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-700 to-indigo-800 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform text-center space-y-3"
            >
              <div className="text-5xl">{svc.icon}</div>
              <h3 className="text-xl font-semibold">{svc.title}</h3>
              <p className="text-gray-300 text-sm">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SCROLL TO TOP */}
      <ScrollToTopButton />
    </div>
  )
}
