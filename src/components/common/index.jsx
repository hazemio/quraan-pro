import React from 'react'
import { motion } from 'framer-motion'

export function LoadingSkeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function SurahCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4">
        <LoadingSkeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <LoadingSkeleton className="h-5 w-32 mb-2" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function AyahSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <LoadingSkeleton className="h-8 w-full" />
      <LoadingSkeleton className="h-8 w-3/4" />
      <LoadingSkeleton className="h-4 w-full mt-4" />
      <LoadingSkeleton className="h-4 w-5/6" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: '#D4AF37',
          borderRightColor: 'rgba(212,175,55,0.3)',
        }}
      />
      <div className="font-cairo text-gray-400">جاري التحميل...</div>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center max-w-md mx-auto"
    >
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-cairo font-bold text-xl text-red-400 mb-2">حدث خطأ</h3>
      <p className="text-gray-400 font-cairo mb-6">{message || 'تعذر تحميل البيانات'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-gold font-cairo">
          إعادة المحاولة
        </button>
      )}
    </motion.div>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`badge ${className}`}>{children}</span>
  )
}

export function Divider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3))' }} />
      <div className="text-gold-500 text-lg">✦</div>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.3))' }} />
    </div>
  )
}

export function IslamicStar({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
    </svg>
  )
}

export function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '-10px',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-30">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M40 0 L80 20 L80 60 L40 80 L0 60 L0 20 Z"
              fill="none"
              stroke="rgba(212,175,55,0.08)"
              strokeWidth="0.5"
            />
            <path
              d="M40 10 L70 25 L70 55 L40 70 L10 55 L10 25 Z"
              fill="none"
              stroke="rgba(212,175,55,0.05)"
              strokeWidth="0.5"
            />
            <circle cx="40" cy="40" r="8" fill="none" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-geo)" />
      </svg>
    </div>
  )
}

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

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
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        🔍
      </div>
    </div>
  )
}

export function NumberBadge({ number }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-cairo font-bold text-sm shrink-0"
      style={{
        background: 'rgba(212,175,55,0.15)',
        border: '1px solid rgba(212,175,55,0.3)',
        color: '#D4AF37',
      }}
    >
      {number}
    </div>
  )
}

export function GlowDivider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px" style={{ background: 'rgba(212,175,55,0.2)' }} />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 bg-islamic-darker" style={{ color: '#D4AF37', fontSize: '20px' }}>
          ۞
        </span>
      </div>
    </div>
  )
}

export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.07 } },
        hidden: {},
      }}
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
