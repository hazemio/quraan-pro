import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme.js'
import { FiHome, FiHeart, FiMenu, FiX } from 'react-icons/fi'
import { GiOpenBook, GiScrollUnfurled, GiPrayer } from 'react-icons/gi'

const navItems = [
  { path: '/',         label: 'الرئيسية',    icon: FiHome },
  { path: '/quran',    label: 'القرآن',       icon: GiOpenBook },
  { path: '/hadith',   label: 'الأحاديث',    icon: GiScrollUnfurled },
  { path: '/azkar',    label: 'الأذكار',      icon: GiPrayer },
  { path: '/favorites',label: 'المفضلة',     icon: FiHeart },
]

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="theme-toggle"
      aria-label="Toggle theme"
      whileTap={{ scale: 0.92 }}
      title={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
    >
      <div className="theme-toggle-knob">
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0,   opacity: 1, scale: 1 }}
              exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: '10px', lineHeight: 1 }}
            >
              🌙
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate:  90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0,   opacity: 1, scale: 1 }}
              exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: '10px', lineHeight: 1 }}
            >
              ☀️
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

export function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-gold)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.1 }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a' }}
            >
              ☽
            </motion.div>
            <div className="hidden sm:block">
              <div className="gold-text font-cairo font-bold text-lg leading-none">نور الإسلام</div>
              <div className="font-cairo text-[10px] leading-none" style={{ color: 'var(--text-muted)' }}>Islamic Platform</div>
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
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: theme toggle + mobile hamburger */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold)',
              }}
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.div key="x"    initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}><FiX    size={18} /></motion.div>
                  : <motion.div key="menu" initial={{ rotate:  90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}><FiMenu size={18} /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col pt-20 pb-8 px-4 gap-2"
              style={{
                background: 'var(--bg-nav)',
                backdropFilter: 'blur(24px)',
                borderLeft: '1px solid var(--border-gold)',
              }}
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
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

              {/* Theme toggle in mobile panel */}
              <div className="mt-auto flex items-center justify-between px-3">
                <span className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>تغيير المظهر</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
