import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import {
  PageTransition, GeometricBackground, StaggerContainer, StaggerItem
} from '../components/common/index.jsx'
import { azkarData, tasbeehOptions } from '../data/azkar.js'
import { FiCheck, FiRotateCcw, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const categories = [
  { key: 'morning',    label: 'أذكار الصباح',       icon: '🌅' },
  { key: 'evening',    label: 'أذكار المساء',        icon: '🌙' },
  { key: 'afterPrayer',label: 'أذكار بعد الصلاة',   icon: '🤲' },
  { key: 'sleep',      label: 'أذكار النوم',         icon: '😴' },
]

/* ── Single Zikr Card ── */
function ZikrCard({ zikr, progress, onIncrement }) {
  const [expanded, setExpanded] = useState(false)
  const done = (progress || 0) >= zikr.count
  const pct  = Math.min(((progress || 0) / zikr.count) * 100, 100)

  return (
    <motion.div
      layout
      whileHover={done ? {} : { scale: 1.008 }}
      className="glass-card p-5 mb-4 cursor-pointer transition-all duration-300"
      style={{ borderColor: done ? 'rgba(45,122,86,0.55)' : 'var(--border-gold)' }}
      onClick={() => !done && onIncrement(zikr.id)}
    >
      <div className="flex items-start gap-3">
        {/* Counter badge */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{
            background: done ? 'rgba(45,122,86,0.25)' : 'rgba(212,175,55,0.10)',
            border: `1px solid ${done ? 'rgba(45,122,86,0.55)' : 'var(--border-gold)'}`,
          }}
        >
          {done
            ? <FiCheck size={14} color="#2d7a56" />
            : <span className="font-cairo text-[10px] font-bold" style={{ color: 'var(--gold)' }}>{progress||0}/{zikr.count}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          {/* Arabic */}
          <div
            className="font-arabic text-lg leading-loose text-right mb-3"
            style={{ color: done ? 'var(--text-muted)' : 'var(--text-ayah)', whiteSpace: 'pre-line' }}
          >
            {zikr.arabic}
          </div>

          {/* Progress bar */}
          {zikr.count > 1 && !done && (
            <div className="w-full h-1 rounded-full mb-3" style={{ background: 'var(--border)' }}>
              <motion.div
                className="h-1 rounded-full"
                style={{ background: 'linear-gradient(to right,#D4AF37,#f0d060)' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>{zikr.reference}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
              className="flex items-center gap-1 font-cairo text-xs"
              style={{ color: 'var(--gold)' }}
            >
              فضل الذكر {expanded ? <FiChevronUp size={11}/> : <FiChevronDown size={11}/>}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>{zikr.virtue}</p>
                  {zikr.translation && (
                    <p className="font-cairo text-xs mt-2 text-left" style={{ color: 'var(--text-muted)' }} dir="ltr">
                      {zikr.translation}
                    </p>
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

/* ── Tasbeeh Counter ── */
function TasbeehCounter() {
  const {
    tasbeehCount, tasbeehTarget, tasbeehLabel,
    incrementTasbeeh, resetTasbeeh, setTasbeehConfig,
  } = useAppStore()
  const [ripple, setRipple]     = useState(false)
  const [selIdx, setSelIdx]     = useState(0)

  const rounds  = Math.floor(tasbeehCount / tasbeehTarget)
  const current = tasbeehCount % tasbeehTarget
  const pct     = (current / tasbeehTarget) * 100
  const C       = 2 * Math.PI * 90   // circumference

  const handleTap = () => {
    incrementTasbeeh()
    setRipple(true)
    setTimeout(() => setRipple(false), 350)
  }

  const selectOption = (idx) => {
    setSelIdx(idx)
    const o = tasbeehOptions[idx]
    setTasbeehConfig(o.label, o.target)
  }

  return (
    <div className="text-center">
      <h2 className="font-cairo font-bold text-2xl mb-7" style={{ color: 'var(--text-primary)' }}>مسبحة رقمية</h2>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tasbeehOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectOption(i)}
            className="px-3 py-2 rounded-xl font-arabic text-sm transition-all duration-300"
            style={selIdx === i
              ? { background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a', fontWeight: 700 }
              : { background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* SVG ring + tap button */}
      <div className="flex justify-center mb-6">
        <div className="relative" style={{ width: 220, height: 220 }}>
          <svg className="absolute inset-0" viewBox="0 0 220 220" width="220" height="220">
            <circle cx="110" cy="110" r="90" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="110" cy="110" r="90"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct / 100)}
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

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleTap}
            className="absolute counter-circle"
            style={{ inset: 20 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{   scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="font-cairo font-black text-5xl"
                style={{ color: 'var(--gold)' }}
              >
                {current}
              </motion.div>
            </AnimatePresence>
            <div className="font-arabic text-sm mt-1" style={{ color: 'var(--text-ayah)' }}>{tasbeehLabel}</div>
            <div className="font-cairo text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>من {tasbeehTarget}</div>
          </motion.button>

          {/* Ripple ring */}
          <AnimatePresence>
            {ripple && (
              <motion.div
                className="absolute rounded-full border-2 pointer-events-none"
                style={{ inset: 20, borderColor: 'var(--gold)' }}
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-7 mb-5">
        <div className="text-center">
          <div className="font-cairo font-black text-2xl gold-text">{rounds}</div>
          <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>دورة مكتملة</div>
        </div>
        <div className="w-px h-10" style={{ background: 'var(--border-gold)' }} />
        <div className="text-center">
          <div className="font-cairo font-black text-2xl gold-text">{tasbeehCount}</div>
          <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>إجمالي</div>
        </div>
      </div>

      <button
        onClick={resetTasbeeh}
        className="flex items-center gap-1.5 mx-auto font-cairo text-sm transition-all"
        style={{ color: 'var(--text-muted)' }}
      >
        <FiRotateCcw size={13} /> إعادة تعيين
      </button>
    </div>
  )
}

/* ── Page ── */
export default function AzkarPage() {
  const [activeCategory, setActiveCategory] = useState('morning')
  const [activeTab,      setActiveTab]      = useState('azkar')
  const { azkarProgress, incrementAzkar, resetAzkarProgress } = useAppStore()

  const currentAzkar  = azkarData[activeCategory] || []
  const completedCount = currentAzkar.filter(z => (azkarProgress[z.id] || 0) >= z.count).length

  const tabStyle = (active) => active
    ? { background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a', fontWeight: 600 }
    : { color: 'var(--text-secondary)' }

  const catStyle = (active) => ({
    borderColor: active ? 'var(--gold)' : 'var(--border-gold)',
    borderWidth:  active ? 2 : 1,
  })

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="font-arabic text-3xl mb-2" style={{ color: 'var(--gold)' }}>الأذكار والتسبيح</div>
            <h1 className="font-cairo font-black text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>الأذكار اليومية</h1>
            <p className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>حصّنوا أنفسكم بذكر الله</p>
          </motion.div>

          {/* Main tab switcher */}
          <div className="glass-card p-1.5 rounded-2xl flex gap-2 mb-8">
            {[['azkar','الأذكار'], ['tasbeeh','المسبحة']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="flex-1 py-2.5 rounded-xl font-cairo font-semibold text-sm transition-all duration-300"
                style={tabStyle(activeTab === key)}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'azkar' ? (
              <motion.div key="azkar" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }}>
                {/* Category grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {categories.map(cat => (
                    <motion.button
                      key={cat.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveCategory(cat.key)}
                      className="glass-card p-4 text-center rounded-xl transition-all duration-300"
                      style={catStyle(activeCategory === cat.key)}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="font-cairo text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>{cat.label}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="glass-card p-4 mb-6 flex items-center justify-between gap-4">
                  <div className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>
                    اكتملت{' '}
                    <span style={{ color: 'var(--gold)' }} className="font-bold">{completedCount}</span>
                    {' '}من{' '}
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentAzkar.length}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 rounded-full" style={{ background: 'var(--border)' }}>
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ background: 'linear-gradient(to right,#D4AF37,#f0d060)' }}
                        animate={{ width: `${currentAzkar.length ? (completedCount/currentAzkar.length)*100 : 0}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    {completedCount > 0 && (
                      <button onClick={resetAzkarProgress} style={{ color: 'var(--text-muted)' }}>
                        <FiRotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Zikr list */}
                <StaggerContainer>
                  {currentAzkar.map(zikr => (
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
              <motion.div key="tasbeeh" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                className="glass-card p-8">
                <TasbeehCounter />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
