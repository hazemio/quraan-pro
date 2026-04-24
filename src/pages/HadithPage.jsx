import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import {
  PageTransition, SearchInput, StaggerContainer, StaggerItem,
  GeometricBackground, Badge, Divider
} from '../components/common/index.jsx'
import { hadithCollections, sampleHadiths } from '../data/hadiths.js'
import { FiHeart, FiShare2, FiChevronDown, FiChevronUp } from 'react-icons/fi'

function CollectionCard({ collection, isSelected, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-5 cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2' : ''}`}
      style={{
        borderColor: isSelected ? '#D4AF37' : 'rgba(30,58,90,0.8)',
        ringColor: '#D4AF37',
      }}
    >
      <div className="text-3xl mb-3">{collection.icon}</div>
      <div className="font-arabic text-xl mb-1" style={{ color: '#e8d5a3' }}>
        {collection.name}
      </div>
      <div className="font-cairo text-xs text-gray-400 mb-2">{collection.nameEn}</div>
      <div className="font-cairo text-xs text-gray-500">{collection.author}</div>
      <div className="mt-3 flex items-center justify-between">
        <span className="badge">{collection.total.toLocaleString()} حديث</span>
        {isSelected && (
          <span style={{ color: '#D4AF37', fontSize: '18px' }}>✓</span>
        )}
      </div>
    </motion.div>
  )
}

function HadithCard({ hadith }) {
  const { addFavoriteHadith, removeFavoriteHadith, isFavoriteHadith } = useAppStore()
  const [expanded, setExpanded] = useState(false)
  const isFav = isFavoriteHadith(hadith.id)

  const toggleFav = () => {
    if (isFav) removeFavoriteHadith(hadith.id)
    else addFavoriteHadith(hadith)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hadith-card mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="badge">{hadith.collectionName}</span>
          <span className="badge" style={{ background: 'rgba(45,122,86,0.2)', borderColor: 'rgba(45,122,86,0.4)', color: '#2d7a56' }}>
            {hadith.grade}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-cairo text-xs text-gray-500">#{hadith.number}</span>
          <button
            onClick={toggleFav}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-islamic-surface"
            style={{ color: isFav ? '#ef4444' : '#6b7280' }}
          >
            <FiHeart size={16} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <div
        className="font-arabic text-xl leading-loose text-right mb-4"
        style={{ color: '#e8d5a3', lineHeight: 2.2 }}
      >
        {hadith.arabic}
      </div>

      {/* English Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 font-cairo text-sm transition-all"
        style={{ color: '#D4AF37' }}
      >
        {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        {expanded ? 'إخفاء الترجمة' : 'عرض الترجمة'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 pt-4 border-t text-left"
              style={{ borderColor: 'rgba(30,58,90,0.8)' }}
            >
              <p className="text-gray-400 font-cairo text-sm leading-relaxed" dir="ltr">
                {hadith.english}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t flex items-center gap-2"
        style={{ borderColor: 'rgba(30,58,90,0.8)' }}>
        <span className="text-gray-500 font-arabic text-sm">رواه: {hadith.narrator}</span>
        <span className="mx-auto" />
        <span className="badge" style={{ background: 'rgba(212,175,55,0.1)', fontSize: '10px' }}>
          {hadith.topic}
        </span>
      </div>
    </motion.div>
  )
}

export default function HadithPage() {
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('all')

  const topics = ['all', ...new Set(sampleHadiths.map(h => h.topic))]

  const filtered = sampleHadiths.filter((h) => {
    const q = search.toLowerCase()
    const matchesSearch = h.arabic.includes(search) || h.english.toLowerCase().includes(q) || h.narrator.includes(search)
    const matchesCollection = !selectedCollection || h.collection === selectedCollection
    const matchesTopic = topic === 'all' || h.topic === topic
    return matchesSearch && matchesCollection && matchesTopic
  })

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="font-arabic text-3xl mb-3" style={{ color: '#D4AF37' }}>
              الأحاديث النبوية الشريفة
            </div>
            <h1 className="font-cairo font-black text-4xl text-white mb-2">الأحاديث النبوية</h1>
            <p className="text-gray-400 font-cairo">كنوز السنة النبوية المطهرة</p>
          </motion.div>

          {/* Collections Grid */}
          <div className="mb-10">
            <h2 className="font-cairo font-bold text-xl text-gray-200 mb-4">المجموعات الحديثية</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {hadithCollections.map((col) => (
                <CollectionCard
                  key={col.id}
                  collection={col}
                  isSelected={selectedCollection === col.id}
                  onClick={() => setSelectedCollection(selectedCollection === col.id ? null : col.id)}
                />
              ))}
            </div>
          </div>

          <Divider />

          {/* Search */}
          <div className="mb-6 space-y-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="ابحث في الأحاديث..."
            />
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 rounded-lg font-cairo text-xs transition-all ${
                    topic === t ? 'text-islamic-darker font-semibold' : 'glass-card text-gray-400 hover:text-white'
                  }`}
                  style={topic === t ? { background: 'linear-gradient(135deg, #D4AF37, #f0d060)' } : {}}
                >
                  {t === 'all' ? 'الكل' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="font-cairo text-sm text-gray-500 mb-4">
            {filtered.length} حديث
            {selectedCollection && ` في ${hadithCollections.find(c => c.id === selectedCollection)?.name}`}
          </div>

          {/* Hadiths */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-cairo">
              <div className="text-4xl mb-4">🔍</div>
              <div>لم يتم العثور على نتائج</div>
            </div>
          ) : (
            <div>
              {filtered.map((h) => (
                <HadithCard key={h.id} hadith={h} />
              ))}
            </div>
          )}

          {/* Note */}
          <div className="mt-8 glass-card p-4 text-center">
            <p className="font-cairo text-xs text-gray-500">
              * هذه عينة من الأحاديث. سيتم تحميل المجموعات الكاملة عند الاتصال بالخادم
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
