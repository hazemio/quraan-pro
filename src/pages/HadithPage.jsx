import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import {
  PageTransition, SearchInput, StaggerContainer, StaggerItem,
  GeometricBackground, Divider
} from '../components/common/index.jsx'
import { hadithCollections, sampleHadiths } from '../data/hadiths.js'
import { FiHeart, FiChevronDown, FiChevronUp } from 'react-icons/fi'

function CollectionCard({ col, isSelected, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="glass-card p-5 cursor-pointer transition-all duration-300"
      style={{ borderColor: isSelected ? 'var(--gold)' : 'var(--border-gold)', borderWidth: isSelected ? 2 : 1 }}
    >
      <div className="text-3xl mb-2">{col.icon}</div>
      <div className="font-arabic text-lg mb-0.5" style={{ color: 'var(--text-ayah)' }}>{col.name}</div>
      <div className="font-cairo text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{col.nameEn}</div>
      <div className="font-cairo text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{col.author}</div>
      <div className="flex items-center justify-between">
        <span className="badge">{col.total.toLocaleString()} حديث</span>
        {isSelected && <span style={{ color: 'var(--gold)', fontSize: 16 }}>✓</span>}
      </div>
    </motion.div>
  )
}

function HadithCard({ hadith }) {
  const { addFavoriteHadith, removeFavoriteHadith, isFavoriteHadith } = useAppStore()
  const [expanded, setExpanded] = useState(false)
  const isFav = isFavoriteHadith(hadith.id)

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card hadith-card mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge">{hadith.collectionName}</span>
          <span className="badge" style={{
            background: 'rgba(26,71,49,0.2)', borderColor: 'rgba(45,122,86,0.35)', color: '#2d7a56'
          }}>{hadith.grade}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>#{hadith.number}</span>
          <button
            onClick={() => isFav ? removeFavoriteHadith(hadith.id) : addFavoriteHadith(hadith)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-surface)', color: isFav ? '#ef4444' : 'var(--text-muted)' }}
          >
            <FiHeart size={14} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="font-arabic text-xl leading-loose text-right mb-4" style={{ color: 'var(--text-ayah)', lineHeight: 2.2 }}>
        {hadith.arabic}
      </div>

      {/* Translation toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 font-cairo text-sm transition-all"
        style={{ color: 'var(--gold)' }}
      >
        {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
        {expanded ? 'إخفاء الترجمة' : 'عرض الترجمة'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t text-left" style={{ borderColor: 'var(--border)' }}>
              <p className="font-cairo text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }} dir="ltr">
                {hadith.english}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
        <span className="font-arabic text-sm" style={{ color: 'var(--text-muted)' }}>رواه: {hadith.narrator}</span>
        <span className="flex-1" />
        <span className="badge" style={{ fontSize: 10 }}>{hadith.topic}</span>
      </div>
    </motion.div>
  )
}

export default function HadithPage() {
  const [selected, setSelected] = useState(null)
  const [search,   setSearch]   = useState('')
  const [topic,    setTopic]    = useState('all')

  const topics  = ['all', ...new Set(sampleHadiths.map(h => h.topic))]
  const filtered = sampleHadiths.filter(h => {
    const q = search.toLowerCase()
    return (
      (h.arabic.includes(search) || h.english.toLowerCase().includes(q) || h.narrator.includes(search)) &&
      (!selected || h.collection === selected) &&
      (topic === 'all' || h.topic === topic)
    )
  })

  const tabStyle = (active) => active
    ? { background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a', fontWeight: 600 }
    : { background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="font-arabic text-3xl mb-2" style={{ color: 'var(--gold)' }}>الأحاديث النبوية الشريفة</div>
            <h1 className="font-cairo font-black text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>الأحاديث النبوية</h1>
            <p className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>كنوز السنة النبوية المطهرة</p>
          </motion.div>

          {/* Collections */}
          <div className="mb-10">
            <h2 className="font-cairo font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>المجموعات الحديثية</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {hadithCollections.map(col => (
                <CollectionCard
                  key={col.id}
                  col={col}
                  isSelected={selected === col.id}
                  onClick={() => setSelected(selected === col.id ? null : col.id)}
                />
              ))}
            </div>
          </div>

          <Divider />

          {/* Search + topic filter */}
          <div className="mb-6 space-y-3">
            <SearchInput value={search} onChange={setSearch} placeholder="ابحث في الأحاديث..." />
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className="px-3 py-1.5 rounded-lg font-cairo text-xs transition-all"
                  style={tabStyle(topic === t)}>
                  {t === 'all' ? 'الكل' : t}
                </button>
              ))}
            </div>
          </div>

          <div className="font-cairo text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} حديث{selected ? ` في ${hadithCollections.find(c=>c.id===selected)?.name}` : ''}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 font-cairo" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-3">🔍</div><div>لم يتم العثور على نتائج</div>
            </div>
          ) : (
            filtered.map(h => <HadithCard key={h.id} hadith={h} />)
          )}

          <div className="mt-8 glass-card p-4 text-center">
            <p className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>
              * هذه عينة من الأحاديث. سيتم تحميل المجموعات الكاملة عند الاتصال بالخادم
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
