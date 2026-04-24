import React from 'react'
import { motion } from 'framer-motion'

/* ── Skeletons ── */
export function LoadingSkeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function SurahCardSkeleton() {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <LoadingSkeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton className="h-5 w-36" />
        <LoadingSkeleton className="h-3 w-24" />
      </div>
      <LoadingSkeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function AyahSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <LoadingSkeleton className="h-7 w-full" />
      <LoadingSkeleton className="h-7 w-3/4" />
      <LoadingSkeleton className="h-4 w-full mt-4" />
      <LoadingSkeleton className="h-4 w-5/6" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 rounded-full border-2 border-transparent"
        style={{ borderTopColor: 'var(--gold)', borderRightColor: 'rgba(212,175,55,0.25)' }}
      />
      <p className="font-cairo text-sm" style={{ color: 'var(--text-muted)' }}>جاري التحميل...</p>
    </div>
  )
}

/* ── Error ── */
export function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center max-w-md mx-auto"
    >
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-cairo font-bold text-xl mb-2" style={{ color: '#f87171' }}>حدث خطأ</h3>
      <p className="font-cairo mb-6" style={{ color: 'var(--text-secondary)' }}>{message || 'تعذر تحميل البيانات'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-gold">إعادة المحاولة</button>
      )}
    </motion.div>
  )
}

/* ── Utility ── */
export function Badge({ children, className = '' }) {
  return <span className={`badge ${className}`}>{children}</span>
}

export function Divider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-gold))' }} />
      <div style={{ color: 'var(--gold)', fontSize: 20 }}>✦</div>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left,  transparent, var(--border-gold))' }} />
    </div>
  )
}

export function GlowDivider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px" style={{ background: 'var(--border-gold)' }} />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4" style={{ background: 'var(--bg-base)', color: 'var(--gold)', fontSize: 22 }}>۞</span>
      </div>
    </div>
  )
}

/* ── Floating Particles (decorative) ── */
export function FloatingParticles() {
  const particles = React.useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      delay: Math.random() * 6,
      duration: Math.random() * 10 + 10,
    })), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, bottom: '-10px' }}
          animate={{ y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 100 : 900)], opacity: [0, 0.55, 0.55, 0], scale: [0.4, 1, 0.7, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

/* ── Geometric Background ── */
export function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.35 }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L80 20 L80 60 L40 80 L0 60 L0 20 Z" fill="none" stroke="var(--border-gold)" strokeWidth="0.6" />
            <path d="M40 10 L70 25 L70 55 L40 70 L10 55 L10 25 Z" fill="none" stroke="var(--border-gold)" strokeWidth="0.3" />
            <circle cx="40" cy="40" r="8" fill="none" stroke="var(--border-gold)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-geo)" />
      </svg>
    </div>
  )
}

/* ── Page Transition wrapper ── */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ── Search Input ── */
export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'ابحث...'}
        className="search-input pr-12"
        dir="auto"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>🔍</div>
    </div>
  )
}

/* ── Number Badge ── */
export function NumberBadge({ number }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-cairo font-bold text-sm flex-shrink-0"
      style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
    >
      {number}
    </div>
  )
}

/* ── Stagger helpers ── */
export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.065 } }, hidden: {} }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.38 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
