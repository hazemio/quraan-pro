import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import {
  PageTransition, GeometricBackground, StaggerContainer, StaggerItem
} from '../components/common/index.jsx'
import { FiBookmark, FiHeart, FiTrash2, FiExternalLink } from 'react-icons/fi'

function EmptyState({ icon, title, desc, link, linkLabel }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-cairo font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="font-cairo text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      {link && <Link to={link} className="btn-gold inline-flex">{linkLabel}</Link>}
    </motion.div>
  )
}

function BookmarkedAyah({ ayah, onRemove }) {
  return (
    <StaggerItem>
      <motion.div layout exit={{ opacity: 0, x: 50, scale: 0.9 }}
        className="glass-card p-5 mb-3"
        style={{ borderRight: '3px solid var(--gold)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="font-arabic text-xl leading-loose text-right mb-2" style={{ color: 'var(--text-ayah)' }}>
              {ayah.text}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="badge">{ayah.surahName}</span>
              <span className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>آية {ayah.numberInSurah}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link to={`/quran/${ayah.surahNumber}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}>
              <FiExternalLink size={12} />
            </Link>
            <button onClick={() => onRemove(ayah.number)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-red-400"
              style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <FiTrash2 size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  )
}

function FavoriteHadith({ hadith, onRemove }) {
  return (
    <StaggerItem>
      <motion.div layout exit={{ opacity: 0, x: 50, scale: 0.9 }}
        className="glass-card p-5 mb-3"
        style={{ borderRight: '3px solid #2d7a56' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="font-arabic text-lg leading-loose text-right mb-2" style={{ color: 'var(--text-ayah)' }}>
              {hadith.arabic}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="badge">{hadith.collectionName}</span>
              <span className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>رقم {hadith.number}</span>
            </div>
          </div>
          <button onClick={() => onRemove(hadith.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-red-400 flex-shrink-0"
            style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.3)' }}>
            <FiTrash2 size={12} />
          </button>
        </div>
      </motion.div>
    </StaggerItem>
  )
}

export default function FavoritesPage() {
  const [tab, setTab] = useState('ayahs')
  const { bookmarkedAyahs, removeBookmark, favoriteHadiths, removeFavoriteHadith, recentSurahs } = useAppStore()

  const tabStyle = (active) => active
    ? { background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a', fontWeight: 600 }
    : { color: 'var(--text-secondary)' }

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="text-4xl mb-3">⭐</div>
            <h1 className="font-cairo font-black text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>المفضلة</h1>
            <p className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>آياتك وأحاديثك المحفوظة</p>
          </motion.div>

          {/* Tab bar */}
          <div className="glass-card p-1.5 rounded-2xl flex gap-2 mb-8">
            {[
              { key: 'ayahs',   label: `الآيات (${bookmarkedAyahs.length})`,   icon: <FiBookmark size={13} /> },
              { key: 'hadiths', label: `الأحاديث (${favoriteHadiths.length})`, icon: <FiHeart size={13} /> },
              { key: 'recent',  label: `الأخيرة (${recentSurahs.length})`,     icon: '🕐' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex-1 py-2.5 rounded-xl font-cairo font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1.5"
                style={tabStyle(tab === t.key)}>
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'ayahs' && (
              <motion.div key="ayahs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {bookmarkedAyahs.length === 0
                  ? <EmptyState icon="🔖" title="لا توجد آيات محفوظة" desc="احفظ آياتك المفضلة من القرآن الكريم" link="/quran" linkLabel="تصفح القرآن" />
                  : <StaggerContainer><AnimatePresence>{bookmarkedAyahs.map(a => <BookmarkedAyah key={a.number} ayah={a} onRemove={removeBookmark} />)}</AnimatePresence></StaggerContainer>
                }
              </motion.div>
            )}
            {tab === 'hadiths' && (
              <motion.div key="hadiths" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {favoriteHadiths.length === 0
                  ? <EmptyState icon="❤️" title="لا توجد أحاديث مفضلة" desc="أضف أحاديثك المفضلة من مجموعة الأحاديث" link="/hadith" linkLabel="تصفح الأحاديث" />
                  : <StaggerContainer><AnimatePresence>{favoriteHadiths.map(h => <FavoriteHadith key={h.id} hadith={h} onRemove={removeFavoriteHadith} />)}</AnimatePresence></StaggerContainer>
                }
              </motion.div>
            )}
            {tab === 'recent' && (
              <motion.div key="recent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {recentSurahs.length === 0
                  ? <EmptyState icon="🕐" title="لا توجد سور مشاهدة" desc="ابدأ القراءة من القرآن الكريم" link="/quran" linkLabel="تصفح القرآن" />
                  : (
                    <StaggerContainer className="space-y-3">
                      {recentSurahs.map(s => (
                        <StaggerItem key={s.number}>
                          <Link to={`/quran/${s.number}`}>
                            <motion.div whileHover={{ scale: 1.02, x: 3 }}
                              className="glass-card p-5 flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-cairo font-bold text-sm flex-shrink-0"
                                style={{ background: 'rgba(212,175,55,0.10)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
                              >{s.number}</div>
                              <div className="flex-1">
                                <div className="font-cairo font-semibold" style={{ color: 'var(--text-primary)' }}>سورة رقم {s.number}</div>
                                <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>آخر قراءة</div>
                              </div>
                              <div className="font-arabic text-xl" style={{ color: 'var(--text-ayah)' }}>{s.name}</div>
                              <FiExternalLink size={14} style={{ color: 'var(--gold)' }} />
                            </motion.div>
                          </Link>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  )
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
