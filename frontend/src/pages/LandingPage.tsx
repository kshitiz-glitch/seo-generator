// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col">

      {/* Hero Section */}
      <section className="flex-grow flex items-center px-8 lg:px-24">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            Elevate SEO with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              AI
            </span>{' '}
            — Rank higher
          </h1>
          <p className="text-lg lg:text-xl text-gray-300">
            Welcome to the forefront of artificial intelligence innovation. We harness the potential of AI to transform industries. Explore our curated resources on everything AI-powered SEO.
          </p>
          <div className="space-x-4">
            <Link
              to="/app"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition px-6 py-3 rounded-full font-medium"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block border border-gray-300 hover:border-gray-100 transition px-6 py-3 rounded-full font-medium"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="hidden lg:block flex-1">
          <img
            src="/hero-3d-ring.png"
            alt="Abstract 3D ring"
            className="w-full max-w-lg"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-8 lg:px-24">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {[
            { title: 'Headline Architect', icon: '📈', desc: 'We craft compelling headlines that capture attention.' },
            { title: 'Voice Weaver',     icon: '🎙️', desc: 'Your SEO content speaks volumes in your unique voice.' },
            { title: 'Global Communicator', icon: '🌐', desc: 'Break language barriers with worldwide-ready SEO copy.' },
          ].map((svc) => (
            <div
              key={svc.title}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 text-center space-y-4"
            >
              <div className="text-4xl">{svc.icon}</div>
              <h3 className="text-xl font-semibold">{svc.title}</h3>
              <p className="text-gray-400">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

