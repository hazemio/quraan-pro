import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import {
  PageTransition, GeometricBackground, StaggerContainer, StaggerItem, GlowDivider
} from '../components/common/index.jsx'
import { azkarData, tasbeehOptions } from '../data/azkar.js'
import { FiCheck, FiRotateCcw, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const categories = [
  { key: 'morning', label: 'أذكار الصباح', icon: '🌅', color: 'from-amber-900/40 to-yellow-900/20' },
  { key: 'evening', label: 'أذكار المساء', icon: '🌙', color: 'from-blue-900/40 to-indigo-900/20' },
  { key: 'afterPrayer', label: 'أذكار بعد الصلاة', icon: '🤲', color: 'from-emerald-900/40 to-green-900/20' },
  { key: 'sleep', label: 'أذكار النوم', icon: '😴', color: 'from-purple-900/40 to-violet-900/20' },
]

function ZikrCard({ zikr, progress, onIncrement }) {
  const [expanded, setExpanded] = useState(false)
  const done = (progress || 0) >= zikr.count
  const pct = Math.min(((progress || 0) / zikr.count) * 100, 100)

  return (
    <motion.div
      layout
      whileHover={{ scale: done ? 1 : 1.01 }}
      className={`glass-card p-5 mb-4 transition-all duration-300 cursor-pointer`}
      style={{ borderColor: done ? 'rgba(45,122,86,0.6)' : 'rgba(30,58,90,0.8)' }}
      onClick={() => !done && onIncrement(zikr.id)}
    >
      <div className="flex items-start gap-3">
        {/* Done indicator */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all duration-300`}
          style={{
            background: done ? 'rgba(45,122,86,0.3)' : 'rgba(212,175,55,0.1)',
            border: `1px solid ${done ? 'rgba(45,122,86,0.6)' : 'rgba(212,175,55,0.3)'}`,
          }}
        >
          {done
            ? <FiCheck size={14} style={{ color: '#2d7a56' }} />
            : <span className="font-cairo text-xs font-bold" style={{ color: '#D4AF37' }}>{progress || 0}/{zikr.count}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          {/* Arabic text */}
          <div
            className="font-arabic text-lg leading-loose text-right mb-3"
            style={{ color: done ? '#6b7280' : '#e8d5a3', whiteSpace: 'pre-line' }}
          >
            {zikr.arabic}
          </div>

          {/* Progress bar */}
          {zikr.count > 1 && !done && (
            <div className="w-full h-1 rounded-full mb-3" style={{ background: 'rgba(30,58,90,0.8)' }}>
              <motion.div
                className="h-1 rounded-full"
                style={{ background: 'linear-gradient(to right, #D4AF37, #f0d060)' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-cairo text-xs text-gray-500">{zikr.reference}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
              className="flex items-center gap-1 font-cairo text-xs transition-all"
              style={{ color: '#D4AF37' }}
            >
              فضل الذكر
              {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(30,58,90,0.8)' }}>
                  <p className="font-cairo text-sm text-gray-400">{zikr.virtue}</p>
                  {zikr.translation && (
                    <p className="font-cairo text-xs text-gray-500 mt-2 text-left" dir="ltr">{zikr.translation}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function TasbeehCounter() {
  const {
    tasbeehCount, tasbeehTarget, tasbeehLabel,
    incrementTasbeeh, resetTasbeeh, setTasbeehConfig
  } = useAppStore()
  const [ripple, setRipple] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const rounds = Math.floor(tasbeehCount / tasbeehTarget)
  const current = tasbeehCount % tasbeehTarget
  const pct = (current / tasbeehTarget) * 100

  const handleTap = () => {
    const count = incrementTasbeeh()
    setRipple(true)
    setTimeout(() => setRipple(false), 300)
    if (count % tasbeehTarget === 0 && count > 0) {
      // completed a round
    }
  }

  const selectOption = (idx) => {
    setSelectedIdx(idx)
    const opt = tasbeehOptions[idx]
    setTasbeehConfig(opt.label, opt.target)
  }

  return (
    <div className="text-center">
      <h2 className="font-cairo font-bold text-2xl text-white mb-8">مسبحة رقمية</h2>

      {/* Tasbeeh options */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tasbeehOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectOption(i)}
            className={`px-3 py-2 rounded-xl font-arabic text-sm transition-all duration-300 ${
              selectedIdx === i ? 'text-islamic-darker' : 'glass-card text-gray-300 hover:text-white'
            }`}
            style={selectedIdx === i ? { background: 'linear-gradient(135deg, #D4AF37, #f0d060)' } : {}}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* SVG Progress Ring */}
      <div className="flex justify-center mb-6">
        <div className="relative" style={{ width: 220, height: 220 }}>
          <svg className="absolute inset-0" viewBox="0 0 220 220" width="220" height="220">
            {/* Background ring */}
            <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(30,58,90,0.8)" strokeWidth="8" />
            {/* Progress ring */}
            <circle
              cx="110" cy="110" r="90"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - pct / 100)}`}
              transform="rotate(-90 110 110)"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#f0d060" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tap button */}
          <motion.button
            className="absolute inset-4 rounded-full flex flex-col items-center justify-center counter-circle"
            style={{ margin: '20px' }}
            whileTap={{ scale: 0.93 }}
            onClick={handleTap}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-cairo font-black text-5xl"
                style={{ color: '#D4AF37' }}
              >
                {current}
              </motion.div>
            </AnimatePresence>
            <div className="font-arabic text-sm mt-1" style={{ color: '#e8d5a3' }}>
              {tasbeehLabel}
            </div>
            <div className="font-cairo text-xs text-gray-500 mt-1">
              من {tasbeehTarget}
            </div>
          </motion.button>

          {/* Ripple */}
          <AnimatePresence>
            {ripple && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: '#D4AF37' }}
                initial={{ opacity: 0.6, scale: 0.85 }}
                animate={{ opacity: 0, scale: 1.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="text-center">
          <div className="font-cairo font-bold text-2xl gold-text">{rounds}</div>
          <div className="font-cairo text-xs text-gray-500">دورة مكتملة</div>
        </div>
        <div className="w-px h-10" style={{ background: 'rgba(212,175,55,0.2)' }} />
        <div className="text-center">
          <div className="font-cairo font-bold text-2xl gold-text">{tasbeehCount}</div>
          <div className="font-cairo text-xs text-gray-500">إجمالي التسبيح</div>
        </div>
      </div>

      <button
        onClick={resetTasbeeh}
        className="flex items-center gap-2 mx-auto font-cairo text-sm text-gray-500 hover:text-gray-300 transition-all"
      >
        <FiRotateCcw size={14} />
        إعادة تعيين
      </button>
    </div>
  )
}

export default function AzkarPage() {
  const [activeCategory, setActiveCategory] = useState('morning')
  const [activeTab, setActiveTab] = useState('azkar')
  const { azkarProgress, incrementAzkar, resetAzkarProgress } = useAppStore()

  const currentAzkar = azkarData[activeCategory] || []
  const completedCount = currentAzkar.filter(z => (azkarProgress[z.id] || 0) >= z.count).length

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="font-arabic text-3xl mb-3" style={{ color: '#D4AF37' }}>الأذكار والتسبيح</div>
            <h1 className="font-cairo font-black text-4xl text-white mb-2">الأذكار اليومية</h1>
            <p className="text-gray-400 font-cairo">حصّنوا أنفسكم بذكر الله</p>
          </motion.div>

          {/* Main Tabs */}
          <div className="flex gap-3 mb-8 glass-card p-1.5 rounded-2xl">
            {[
              { key: 'azkar', label: 'الأذكار' },
              { key: 'tasbeeh', label: 'المسبحة' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 rounded-xl font-cairo font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.key ? 'text-islamic-darker' : 'text-gray-400 hover:text-white'
                }`}
                style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #D4AF37, #f0d060)' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'azkar' ? (
              <motion.div
                key="azkar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Category Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`glass-card p-4 text-center rounded-xl transition-all duration-300 bg-gradient-to-br ${cat.color}`}
                      style={{ borderColor: activeCategory === cat.key ? '#D4AF37' : 'rgba(30,58,90,0.8)' }}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="font-cairo text-xs text-gray-300 leading-tight">{cat.label}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Progress */}
                <div className="glass-card p-4 mb-6 flex items-center justify-between">
                  <div className="font-cairo text-sm text-gray-400">
                    اكتملت <span style={{ color: '#D4AF37' }} className="font-bold">{completedCount}</span> من <span className="font-bold text-white">{currentAzkar.length}</span> أذكار
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 rounded-full" style={{ background: 'rgba(30,58,90,0.8)' }}>
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ background: 'linear-gradient(to right, #D4AF37, #f0d060)' }}
                        animate={{ width: `${(completedCount / currentAzkar.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    {completedCount > 0 && (
                      <button
                        onClick={resetAzkarProgress}
                        className="font-cairo text-xs text-gray-500 hover:text-gray-300"
                      >
                        <FiRotateCcw size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Azkar List */}
                <StaggerContainer>
                  {currentAzkar.map((zikr) => (
                    <ZikrCard
                      key={zikr.id}
                      zikr={zikr}
                      progress={azkarProgress[zikr.id]}
                      onIncrement={incrementAzkar}
                    />
                  ))}
                </StaggerContainer>
              </motion.div>
            ) : (
              <motion.div
                key="tasbeeh"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8"
              >
                <TasbeehCounter />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
