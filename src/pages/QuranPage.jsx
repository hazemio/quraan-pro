import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import {
  PageTransition, SurahCardSkeleton, ErrorMessage, SearchInput,
  StaggerContainer, StaggerItem, Badge, GeometricBackground
} from '../components/common/index.jsx'
import { useAppStore } from '../store/appStore'

const JUZZ_NAMES = [
  'الفاتحة', 'سيقول', 'تلك الرسل', 'لن تنالوا', 'والمحصنات',
  'لا يحب الله', 'وإذا سمعوا', 'ولو أننا', 'قال الملأ', 'واعلموا',
  'يعتذرون', 'وما من دابة', 'وما أبرئ', 'ربما', 'سبحان الذي',
  'قال ألم', 'اقترب', 'قد أفلح', 'وقال الذين', 'أمن خلق',
  'اتل ما أوحي', 'ومن يقنت', 'وما لي', 'فمن أظلم', 'إليه يرد',
  'حم', 'قال فما خطبكم', 'قد سمع', 'تبارك', 'عم'
]

const revelationColor = {
  Meccan: 'rgba(212,175,55,0.2)',
  Medinan: 'rgba(45,122,86,0.2)',
}

function SurahCard({ surah, index }) {
  const addRecent = useAppStore((s) => s.addRecentSurah)

  return (
    <StaggerItem>
      <Link
        to={`/quran/${surah.number}`}
        onClick={() => addRecent({ number: surah.number, name: surah.name })}
      >
        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.99 }}
          className="surah-card flex items-center gap-4"
        >
          {/* Number */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-cairo font-bold"
            style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37',
            }}
          >
            {surah.number}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-cairo font-bold text-white">{surah.englishName}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-cairo"
                style={{
                  background: revelationColor[surah.revelationType] || 'rgba(100,100,100,0.2)',
                  color: surah.revelationType === 'Meccan' ? '#D4AF37' : '#2d7a56',
                }}
              >
                {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
              </span>
            </div>
            <div className="text-gray-500 font-cairo text-xs">{surah.englishNameTranslation} • {surah.numberOfAyahs} آية</div>
          </div>

          {/* Arabic Name */}
          <div
            className="font-arabic text-xl shrink-0"
            style={{ color: '#e8d5a3' }}
          >
            {surah.name}
          </div>
        </motion.div>
      </Link>
    </StaggerItem>
  )
}

export default function QuranPage() {
  const [surahs, setSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchSurahs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('https://api.alquran.cloud/v1/surah')
      setSurahs(res.data.data)
    } catch (e) {
      setError('تعذر تحميل قائمة السور')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSurahs() }, [])

  const filtered = surahs.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    const matchesFilter = filter === 'all' || s.revelationType === filter
    return matchesSearch && matchesFilter
  })

  return (
    <PageTransition>
      <GeometricBackground />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="font-arabic text-3xl mb-3" style={{ color: '#D4AF37' }}>
              القرآن الكريم
            </div>
            <h1 className="font-cairo font-black text-4xl text-white mb-2">السور القرآنية</h1>
            <p className="text-gray-400 font-cairo">اختر سورة للقراءة والاستماع</p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="ابحث عن سورة بالاسم أو الرقم..."
            />
            <div className="flex gap-3">
              {[
                { v: 'all', label: 'الكل' },
                { v: 'Meccan', label: 'مكية' },
                { v: 'Medinan', label: 'مدنية' },
              ].map((f) => (
                <button
                  key={f.v}
                  onClick={() => setFilter(f.v)}
                  className={`px-4 py-2 rounded-xl font-cairo text-sm transition-all duration-300 ${
                    filter === f.v
                      ? 'text-islamic-darker font-semibold'
                      : 'text-gray-400 hover:text-white glass-card'
                  }`}
                  style={filter === f.v ? { background: 'linear-gradient(135deg, #D4AF37, #f0d060)' } : {}}
                >
                  {f.label}
                </button>
              ))}
              {search || filter !== 'all' ? (
                <button
                  onClick={() => { setSearch(''); setFilter('all') }}
                  className="px-4 py-2 rounded-xl font-cairo text-sm text-gray-500 hover:text-white glass-card transition-all"
                >
                  إعادة تعيين
                </button>
              ) : null}
            </div>
          </motion.div>

          {/* Count */}
          {!loading && (
            <div className="mb-4 font-cairo text-sm text-gray-500">
              {filtered.length} سورة {search ? `لـ "${search}"` : ''}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <SurahCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchSurahs} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-cairo">
              <div className="text-4xl mb-4">🔍</div>
              <div>لم يتم العثور على نتائج</div>
            </div>
          ) : (
            <StaggerContainer className="space-y-3">
              {filtered.map((surah, i) => (
                <SurahCard key={surah.number} surah={surah} index={i} />
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
