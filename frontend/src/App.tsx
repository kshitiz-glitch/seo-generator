// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header       from './components/Header'
import LandingPage  from './pages/LandingPage'
import SignupPage   from './pages/SignupPage'
import LoginPage    from './pages/LoginPage'
import HomePage     from './pages/HomePage'
import ResultPage   from './pages/ResultPage'
import HistoryPage  from './pages/HistoryPage'
import RequireAuth  from './components/RequireAuth'

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Header */}
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* App functionality */}
        <Route path="/app" element={<HomePage />} />
        <Route path="/job/:jobId" element={<ResultPage />} />

        {/* Authenticated route */}
        <Route
          path="/history"
          element={
            <RequireAuth>
              <HistoryPage />
            </RequireAuth>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
