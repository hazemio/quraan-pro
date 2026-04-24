import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { FloatingParticles, GeometricBackground, Divider, StaggerContainer, StaggerItem } from '../components/common/index.jsx'

const quickLinks = [
  { path: '/quran', icon: '📖', label: 'القرآن الكريم', sub: '114 سورة', color: 'from-amber-900/40 to-amber-800/20' },
  { path: '/hadith', icon: '📜', label: 'الأحاديث النبوية', sub: '6 مجموعات', color: 'from-emerald-900/40 to-emerald-800/20' },
  { path: '/azkar', icon: '🤲', label: 'الأذكار', sub: 'صباح ومساء وتسبيح', color: 'from-blue-900/40 to-blue-800/20' },
  { path: '/favorites', icon: '⭐', label: 'المفضلة', sub: 'آياتك وأحاديثك', color: 'from-purple-900/40 to-purple-800/20' },
]

const prayerTimes = [
  { name: 'الفجر', time: '05:23', icon: '🌙' },
  { name: 'الظهر', time: '12:30', icon: '☀️' },
  { name: 'العصر', time: '15:45', icon: '🌤️' },
  { name: 'المغرب', time: '18:52', icon: '🌅' },
  { name: 'العشاء', time: '20:15', icon: '🌙' },
]

function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[400, 600, 800].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              borderColor: `rgba(212,175,55,${0.06 - i * 0.015})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Crescent glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(26,71,49,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl"
      >
        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <div
            className="font-arabic text-4xl md:text-5xl leading-loose mb-2"
            style={{ color: '#D4AF37', textShadow: '0 0 40px rgba(212,175,55,0.4)' }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-7xl font-cairo font-black mb-4"
        >
          <span className="gold-text">نور الإسلام</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 font-cairo text-lg md:text-xl mb-2"
        >
          منصتك الإسلامية الشاملة
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 font-cairo text-sm mb-10"
        >
          قرآن كريم • أحاديث نبوية • أذكار يومية
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/quran" className="btn-gold text-base">
            ابدأ القراءة ✦
          </Link>
          <Link to="/azkar" className="btn-outline text-base">
            أذكار اليوم 🤲
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: 'rgba(212,175,55,0.5)' }}
      >
        ↓
      </motion.div>
    </div>
  )
}

function RecentlyViewed() {
  const recentSurahs = useAppStore((s) => s.recentSurahs)
  if (!recentSurahs.length) return null

  return (
    <div className="mb-12">
      <h3 className="font-cairo font-bold text-xl text-gray-200 mb-4 flex items-center gap-2">
        <span style={{ color: '#D4AF37' }}>🕐</span> آخر ما قرأت
      </h3>
      <div className="flex flex-wrap gap-3">
        {recentSurahs.map((s) => (
          <Link
            key={s.number}
            to={`/quran/${s.number}`}
            className="glass-card px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            style={{ borderColor: 'rgba(212,175,55,0.2)' }}
          >
            <span style={{ color: '#D4AF37' }} className="font-cairo text-sm">{s.number}.</span>
            <span className="font-cairo text-sm text-gray-200">{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function DailyVerse() {
  const verse = {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    translation: 'And whoever fears Allah - He will make for him a way out. And will provide for him from where he does not expect.',
    reference: 'سورة الطلاق: 2-3',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 text-center mb-12"
      style={{ borderColor: 'rgba(212,175,55,0.3)' }}
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <span style={{ color: '#D4AF37' }}>✦</span>
        <span className="font-cairo font-bold text-lg" style={{ color: '#D4AF37' }}>آية اليوم</span>
        <span style={{ color: '#D4AF37' }}>✦</span>
      </div>
      <div
        className="font-arabic text-2xl md:text-3xl leading-loose mb-6"
        style={{ color: '#e8d5a3' }}
      >
        {verse.arabic}
      </div>
      <div className="text-gray-400 font-cairo text-sm mb-4 italic">{verse.translation}</div>
      <span className="badge">{verse.reference}</span>
    </motion.div>
  )
}

export default function HomePage() {
  const recentSurahs = useAppStore((s) => s.recentSurahs)

  return (
    <div className="relative">
      <FloatingParticles />
      <GeometricBackground />

      <HeroSection />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        {/* Quick Access */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {quickLinks.map((link) => (
            <StaggerItem key={link.path}>
              <Link to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`glass-card p-6 text-center cursor-pointer bg-gradient-to-br ${link.color} h-full`}
                  style={{ borderColor: 'rgba(212,175,55,0.15)' }}
                >
                  <div className="text-4xl mb-3">{link.icon}</div>
                  <div className="font-cairo font-bold text-white mb-1">{link.label}</div>
                  <div className="font-cairo text-xs text-gray-400">{link.sub}</div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <RecentlyViewed />

        {/* Daily Verse */}
        <DailyVerse />

        {/* Prayer Times Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <h3 className="font-cairo font-bold text-xl text-center mb-6 gold-text">مواقيت الصلاة</h3>
          <div className="grid grid-cols-5 gap-3">
            {prayerTimes.map((p) => (
              <div key={p.name} className="text-center">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="font-cairo font-bold text-white text-sm">{p.name}</div>
                <div className="font-cairo text-xs mt-1" style={{ color: '#D4AF37' }}>{p.time}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-xs font-cairo mt-4">* مواقيت تقريبية - يرجى التحقق من مواقيت بلدك</p>
        </motion.div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '114', label: 'سورة قرآنية' },
            { n: '6,236', label: 'آية كريمة' },
            { n: '30', label: 'جزءاً شريفاً' },
            { n: '∞', label: 'بركة ونور' },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="glass-card p-5 text-center">
                <div className="font-cairo font-black text-3xl gold-text mb-1">{stat.n}</div>
                <div className="font-cairo text-gray-400 text-sm">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
