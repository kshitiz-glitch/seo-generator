// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header       from './components/Header'
import LandingPage  from './pages/LandingPage'
import SignupPage   from './pages/SignupPage'
import LoginPage    from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ResultPage   from './pages/ResultPage'
import HistoryPage  from './pages/HistoryPage'
import RequireAuth  from './components/RequireAuth'

export default function App() {
  return (
    <BrowserRouter>
      {/* Single Header for all pages */}
      <Header />

      <Routes>
        {/* Public marketing & auth */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login"  element={<LoginPage />} />

        {/* Core app flows */}
        <Route path="/app"        element={<HomePage />} />
        <Route path="/job/:jobId" element={<ResultPage />} />

        {/* Protected history */}
        <Route
          path="/history"
          element={
            <RequireAuth>
              <HistoryPage />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
