import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import {
  FiHome, FiBook, FiStar, FiMoon, FiSun, FiMenu, FiX,
  FiBookmark, FiHeart, FiSearch
} from 'react-icons/fi'
import { GiOpenBook, GiScrollUnfurled, GiPrayer } from 'react-icons/gi'

const navItems = [
  { path: '/', label: 'الرئيسية', icon: FiHome },
  { path: '/quran', label: 'القرآن الكريم', icon: GiOpenBook },
  { path: '/hadith', label: 'الأحاديث', icon: GiScrollUnfurled },
  { path: '/azkar', label: 'الأذكار', icon: GiPrayer },
  { path: '/favorites', label: 'المفضلة', icon: FiHeart },
]

export function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(6,14,26,0.98) 0%, rgba(6,14,26,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)', color: '#060e1a' }}>
              ☽
            </div>
            <div>
              <div className="gold-text font-cairo font-bold text-lg leading-none">نور الإسلام</div>
              <div className="text-gray-500 text-[10px] leading-none font-cairo">Islamic Platform</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link text-sm font-cairo ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-islamic-card"
              style={{ color: '#D4AF37' }}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-islamic-card transition-all"
              style={{ color: '#D4AF37' }}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{
              background: 'rgba(6,14,26,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(212,175,55,0.15)',
            }}
          >
            <div className="p-4 flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`nav-link text-base font-cairo ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
