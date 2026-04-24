import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTheme } from './hooks/useTheme.js'
import { Navbar } from './components/layout/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import QuranPage from './pages/QuranPage.jsx'
import SurahPage from './pages/SurahPage.jsx'
import HadithPage from './pages/HadithPage.jsx'
import AzkarPage from './pages/AzkarPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<HomePage />} />
        <Route path="/quran"      element={<QuranPage />} />
        <Route path="/quran/:id"  element={<SurahPage />} />
        <Route path="/hadith"     element={<HadithPage />} />
        <Route path="/azkar"      element={<AzkarPage />} />
        <Route path="/favorites"  element={<FavoritesPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  // useTheme syncs darkMode → html.classList on every change
  useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
