import React, { lazy, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme.js'
import { useAppStore } from '../store/appStore'
import {
  FloatingParticles, GeometricBackground, Divider,
  StaggerContainer, StaggerItem
} from '../components/common/index.jsx'

// ✅ Lazy-load the heavy 3D component
const IslamicLanternScene = lazy(() => import('../components/three/IslamicLantern.jsx'))

/* Detect mobile to skip heavy 3D on low-end devices */
function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent)
}

const quickLinks = [
  { path: '/quran',     icon: '📖', label: 'القرآن الكريم',     sub: '114 سورة',             color: 'rgba(180,130,20,0.12)' },
  { path: '/hadith',    icon: '📜', label: 'الأحاديث النبوية',  sub: '6 مجموعات',            color: 'rgba(26,71,49,0.18)' },
  { path: '/azkar',     icon: '🤲', label: 'الأذكار',           sub: 'صباح ومساء وتسبيح',    color: 'rgba(30,58,120,0.18)' },
  { path: '/favorites', icon: '⭐', label: 'المفضلة',           sub: 'آياتك وأحاديثك',       color: 'rgba(100,20,120,0.18)' },
]

const prayerTimes = [
  { name: 'الفجر',    time: '05:23', icon: '🌙' },
  { name: 'الظهر',   time: '12:30', icon: '☀️' },
  { name: 'العصر',   time: '15:45', icon: '🌤️' },
  { name: 'المغرب',  time: '18:52', icon: '🌅' },
  { name: 'العشاء',  time: '20:15', icon: '🌙' },
]

/* ── 3D Section with lazy load + spinner ── */
function LanternSection({ darkMode }) {
  const [mobile] = useState(isMobile)
  const [show3D, setShow3D] = useState(false)

  // Slight defer so page paints first
  useEffect(() => {
    const t = setTimeout(() => setShow3D(true), 400)
    return () => clearTimeout(t)
  }, [])

  if (mobile) {
    // Lightweight fallback for mobile
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: 80, filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.6))' }}
        >
          🪔
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading spinner shown until Suspense resolves */}
      {!show3D && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: 'var(--gold)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {show3D && (
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full border-2 border-transparent"
              style={{ borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }}
            />
          </div>
        }>
          <IslamicLanternScene darkMode={darkMode} className="w-full h-full" />
        </Suspense>
      )}

      {/* Hover hint */}
      <p
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-cairo pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      >
        اسحب للتدوير
      </p>
    </div>
  )
}

/* ── Hero ── */
function HeroSection({ darkMode }) {
  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">

      {/* Rotating background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[420, 640, 860].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              border: `1px solid rgba(212,175,55,${0.07 - i * 0.015})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 28 + i * 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)`, filter: 'blur(50px)' }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      />

      {/* Grid: text LEFT + lantern RIGHT on desktop; stacked on mobile */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* ── Text column ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:text-right"
        >
          {/* Bismillah */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-6"
          >
            <div
              className="font-arabic text-3xl md:text-4xl leading-loose"
              style={{ color: 'var(--gold)', textShadow: '0 0 40px rgba(212,175,55,0.35)' }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-cairo font-black text-5xl md:text-6xl mb-3"
          >
            <span className="gold-text">نور الإسلام</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-cairo text-lg mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            منصتك الإسلامية الشاملة
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-cairo text-sm mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            قرآن كريم • أحاديث نبوية • أذكار يومية
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-3"
          >
            <Link to="/quran"  className="btn-gold text-sm">ابدأ القراءة ✦</Link>
            <Link to="/azkar"  className="btn-outline text-sm">أذكار اليوم 🤲</Link>
          </motion.div>
        </motion.div>

        {/* ── 3D Lantern column ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
          className="h-[340px] md:h-[460px] relative"
        >
          {/* Glow plate behind lantern */}
          <div
            className="absolute inset-0 rounded-full m-auto pointer-events-none"
            style={{
              width: '60%', height: '60%',
              top: '20%', left: '20%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          <LanternSection darkMode={darkMode} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ color: 'rgba(212,175,55,0.45)', fontSize: 20 }}
      >
        ↓
      </motion.div>
    </div>
  )
}

/* ── Recently Viewed ── */
function RecentlyViewed() {
  const recentSurahs = useAppStore((s) => s.recentSurahs)
  if (!recentSurahs.length) return null
  return (
    <div className="mb-10">
      <h3 className="font-cairo font-bold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span style={{ color: 'var(--gold)' }}>🕐</span> آخر ما قرأت
      </h3>
      <div className="flex flex-wrap gap-3">
        {recentSurahs.map((s) => (
          <Link
            key={s.number}
            to={`/quran/${s.number}`}
            className="glass-card px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span style={{ color: 'var(--gold)' }} className="font-cairo text-sm">{s.number}.</span>
            <span className="font-cairo text-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ── Daily Verse ── */
function DailyVerse() {
  const verse = {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    translation: 'And whoever fears Allah – He will make for him a way out. And will provide for him from where he does not expect.',
    ref: 'سورة الطلاق: 2-3',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 text-center mb-10"
    >
      <div className="flex items-center justify-center gap-2 mb-5">
        <span style={{ color: 'var(--gold)' }}>✦</span>
        <span className="font-cairo font-bold text-lg gold-text">آية اليوم</span>
        <span style={{ color: 'var(--gold)' }}>✦</span>
      </div>
      <div className="font-arabic text-2xl md:text-3xl leading-loose mb-5" style={{ color: 'var(--text-ayah)' }}>
        {verse.arabic}
      </div>
      <p className="font-cairo text-sm mb-4 italic" style={{ color: 'var(--text-secondary)' }}>{verse.translation}</p>
      <span className="badge">{verse.ref}</span>
    </motion.div>
  )
}

/* ── Main Export ── */
export default function HomePage() {
  const { darkMode } = useTheme()

  return (
    <div className="relative">
      <FloatingParticles />
      <GeometricBackground />

      <HeroSection darkMode={darkMode} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        {/* Quick access grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {quickLinks.map((link) => (
            <StaggerItem key={link.path}>
              <Link to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card p-6 text-center cursor-pointer h-full"
                  style={{ background: link.color }}
                >
                  <div className="text-4xl mb-3">{link.icon}</div>
                  <div className="font-cairo font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{link.label}</div>
                  <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>{link.sub}</div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <RecentlyViewed />
        <DailyVerse />

        {/* Prayer Times */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-10"
        >
          <h3 className="font-cairo font-bold text-xl text-center mb-6 gold-text">مواقيت الصلاة</h3>
          <div className="grid grid-cols-5 gap-3">
            {prayerTimes.map((p) => (
              <div key={p.name} className="text-center">
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="font-cairo font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                <div className="font-cairo text-xs mt-1" style={{ color: 'var(--gold)' }}>{p.time}</div>
              </div>
            ))}
          </div>
          <p className="text-center font-cairo text-xs mt-4" style={{ color: 'var(--text-muted)' }}>* مواقيت تقريبية</p>
        </motion.div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '114',    label: 'سورة قرآنية' },
            { n: '6,236',  label: 'آية كريمة' },
            { n: '30',     label: 'جزءاً شريفاً' },
            { n: '∞',      label: 'بركة ونور' },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <div className="glass-card p-5 text-center">
                <div className="font-cairo font-black text-3xl gold-text mb-1">{s.n}</div>
                <div className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
