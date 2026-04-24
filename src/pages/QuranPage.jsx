import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import {
  PageTransition, SurahCardSkeleton, ErrorMessage, SearchInput,
  StaggerContainer, StaggerItem, GeometricBackground
} from '../components/common/index.jsx'
import { useAppStore } from '../store/appStore'

function SurahCard({ surah }) {
  const addRecent = useAppStore((s) => s.addRecentSurah)
  const isMeccan = surah.revelationType === 'Meccan'

  return (
    <StaggerItem>
      <Link
        to={`/quran/${surah.number}`}
        onClick={() => addRecent({ number: surah.number, name: surah.name })}
      >
        <motion.div whileTap={{ scale: 0.99 }} className="glass-card surah-card flex items-center gap-4">
          {/* Number badge */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-cairo font-bold text-sm flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.10)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
          >
            {surah.number}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-cairo font-semibold" style={{ color: 'var(--text-primary)' }}>{surah.englishName}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-cairo"
                style={{
                  background: isMeccan ? 'rgba(212,175,55,0.12)' : 'rgba(26,71,49,0.25)',
                  color:       isMeccan ? 'var(--gold)' : '#2d7a56',
                }}
              >
                {isMeccan ? 'مكية' : 'مدنية'}
              </span>
            </div>
            <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>
              {surah.englishNameTranslation} • {surah.numberOfAyahs} آية
            </div>
          </div>

          {/* Arabic name */}
          <div className="font-arabic text-xl flex-shrink-0" style={{ color: 'var(--text-ayah)' }}>
            {surah.name}
          </div>
        </motion.div>
      </Link>
    </StaggerItem>
  )
}

export default function QuranPage() {
  const [surahs,  setSurahs]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')

  const fetchSurahs = async () => {
    setLoading(true); setError(null)
    try {
      const res = await axios.get('https://api.alquran.cloud/v1/surah')
      setSurahs(res.data.data)
    } catch { setError('تعذر تحميل قائمة السور') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSurahs() }, [])

  const filtered = surahs.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch =
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    const matchFilter = filter === 'all' || s.revelationType === filter
    return matchSearch && matchFilter
  })

  const filterBtnStyle = (active) => active
    ? { background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a', fontWeight: 600 }
    : { background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="font-arabic text-3xl mb-2" style={{ color: 'var(--gold)' }}>القرآن الكريم</div>
            <h1 className="font-cairo font-black text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>السور القرآنية</h1>
            <p className="font-cairo text-sm" style={{ color: 'var(--text-secondary)' }}>اختر سورة للقراءة والاستماع</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-7 space-y-3">
            <SearchInput value={search} onChange={setSearch} placeholder="ابحث عن سورة بالاسم أو الرقم..." />
            <div className="flex gap-2 flex-wrap">
              {[['all','الكل'], ['Meccan','مكية'], ['Medinan','مدنية']].map(([v, l]) => (
                <button key={v} onClick={() => setFilter(v)}
                  className="px-4 py-2 rounded-xl font-cairo text-sm transition-all duration-300"
                  style={filterBtnStyle(filter === v)}>
                  {l}
                </button>
              ))}
              {(search || filter !== 'all') && (
                <button onClick={() => { setSearch(''); setFilter('all') }}
                  className="px-4 py-2 rounded-xl font-cairo text-sm transition-all"
                  style={{ color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  إعادة تعيين
                </button>
              )}
            </div>
          </motion.div>

          {!loading && (
            <div className="font-cairo text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} سورة{search ? ` لـ "${search}"` : ''}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">{Array.from({length:12}).map((_,i)=><SurahCardSkeleton key={i}/>)}</div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchSurahs} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 font-cairo" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-3">🔍</div><div>لم يتم العثور على نتائج</div>
            </div>
          ) : (
            <StaggerContainer className="space-y-3">
              {filtered.map((s) => <SurahCard key={s.number} surah={s} />)}
            </StaggerContainer>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
