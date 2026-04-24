import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAppStore } from '../store/appStore'
import { PageTransition, AyahSkeleton, ErrorMessage, GeometricBackground } from '../components/common/index.jsx'
import { FiBookmark, FiPlay, FiPause, FiArrowRight, FiArrowLeft, FiMaximize2, FiMinimize2 } from 'react-icons/fi'

function AyahCard({ ayah, translation, isBookmarked, onBookmark }) {
  const [showTrans, setShowTrans] = useState(true)
  const [playing, setPlaying]     = useState(false)
  const audioRef = useRef(null)

  const toggleAudio = () => {
    if (!ayah.audio) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else         { audioRef.current.play();  setPlaying(true)  }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-4 group"
      style={{ borderColor: isBookmarked ? 'rgba(212,175,55,0.55)' : 'var(--border-gold)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-cairo text-sm font-bold"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
        >
          {ayah.numberInSurah}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {ayah.audio && (
            <>
              <audio ref={audioRef} src={ayah.audio} onEnded={() => setPlaying(false)} />
              <button
                onClick={toggleAudio}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-surface)', color: 'var(--gold)' }}
              >
                {playing ? <FiPause size={13} /> : <FiPlay size={13} />}
              </button>
            </>
          )}
          <button
            onClick={() => onBookmark(ayah)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-surface)', color: isBookmarked ? 'var(--gold)' : 'var(--text-muted)' }}
          >
            <FiBookmark size={13} fill={isBookmarked ? 'var(--gold)' : 'none'} />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="ayah-text text-right mb-4" style={{ fontFamily: 'Amiri, serif' }}>
        {ayah.text}
        <span style={{ color: 'var(--gold)', fontSize: '1.15rem', margin: '0 0.4rem' }}>﴿{ayah.numberInSurah}﴾</span>
      </div>

      {/* Translation */}
      {showTrans && translation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t pt-4 mt-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="font-cairo text-sm leading-relaxed text-left" style={{ color: 'var(--text-secondary)' }} dir="ltr">
            {translation.text}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function SurahPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [surah,     setSurah]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [focusMode, setFocusMode] = useState(false)
  const [showTrans, setShowTrans] = useState(true)
  const [playing,   setPlaying]   = useState(false)
  const audioRef = useRef(null)
  const { addBookmark, removeBookmark, isBookmarked, addRecentSurah, setLastRead } = useAppStore()

  const fetchSurah = async () => {
    setLoading(true); setError(null)
    try {
      const res = await axios.get(
        `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad,ar.alafasy`
      )
      const [arabic, translation, audio] = res.data.data
      setSurah({ arabic, translation, audio })
      addRecentSurah({ number: arabic.number, name: arabic.name })
      setLastRead({ surahNumber: arabic.number, surahName: arabic.name })
    } catch { setError('تعذر تحميل السورة') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSurah() }, [id])

  const handleBookmark = (ayah) => {
    const data = {
      number: ayah.number, numberInSurah: ayah.numberInSurah,
      text: ayah.text, surahNumber: surah?.arabic?.number, surahName: surah?.arabic?.name,
    }
    isBookmarked(ayah.number) ? removeBookmark(ayah.number) : addBookmark(data)
  }

  const toggleFullAudio = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else         { audioRef.current.play();  setPlaying(true)  }
  }

  const num = parseInt(id)

  if (loading) return (
    <div className="pt-24 max-w-3xl mx-auto px-4 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => <AyahSkeleton key={i} />)}
    </div>
  )

  if (error) return (
    <div className="pt-32 flex items-center justify-center">
      <ErrorMessage message={error} onRetry={fetchSurah} />
    </div>
  )

  const arabicAyahs      = surah?.arabic?.ayahs     || []
  const translationAyahs = surah?.translation?.ayahs || []
  const audioAyahs       = surah?.audio?.ayahs       || []

  return (
    <PageTransition>
      <div
        className="relative min-h-screen"
        style={{ background: focusMode ? 'var(--bg-base)' : undefined }}
      >
        {!focusMode && <GeometricBackground />}

        <div className="relative z-10 pt-16">
          {/* Sticky sub-navbar */}
          <div
            className="sticky top-16 z-40 py-3 px-4 mb-2"
            style={{
              background: 'var(--bg-nav)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-gold)',
            }}
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
              {/* Back + title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/quran')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
                >
                  <FiArrowRight size={16} />
                </button>
                <div>
                  <div className="font-cairo font-bold" style={{ color: 'var(--text-primary)' }}>
                    {surah?.arabic?.englishName}
                  </div>
                  <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>
                    {arabicAyahs.length} آية
                  </div>
                </div>
              </div>

              {/* Arabic name */}
              <div className="font-arabic text-2xl" style={{ color: 'var(--gold)' }}>
                {surah?.arabic?.name}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTrans(!showTrans)}
                  className="px-3 py-1.5 rounded-lg font-cairo text-xs transition-all"
                  style={showTrans
                    ? { background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a', fontWeight: 600 }
                    : { background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                  }
                >
                  ترجمة
                </button>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
                >
                  {focusMode ? <FiMinimize2 size={15} /> : <FiMaximize2 size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Surah header */}
          <div className="text-center py-8 max-w-3xl mx-auto px-4">
            {surah?.arabic?.number !== 1 && surah?.arabic?.number !== 9 && (
              <div
                className="font-arabic text-3xl md:text-4xl mb-5"
                style={{ color: 'var(--gold)', textShadow: '0 0 24px rgba(212,175,55,0.3)' }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </div>
            )}

            {/* Audio player */}
            <div
              className="glass-card inline-flex items-center gap-4 px-6 py-3 rounded-2xl mb-6"
            >
              <button
                onClick={toggleFullAudio}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#f0d060)', color: '#060e1a' }}
              >
                {playing ? <FiPause size={15} /> : <FiPlay size={15} />}
              </button>
              <div>
                <div className="font-cairo text-sm" style={{ color: 'var(--text-primary)' }}>استماع كامل للسورة</div>
                <div className="font-cairo text-xs" style={{ color: 'var(--text-muted)' }}>الشيخ مشاري العفاسي</div>
              </div>
            </div>

            {/* Prev / Next surah */}
            <div className="flex items-center justify-center gap-3">
              {num > 1 && (
                <Link to={`/quran/${num - 1}`} className="btn-outline text-sm py-2 px-4">
                  <FiArrowRight size={13} className="inline ml-1" /> السابقة
                </Link>
              )}
              {num < 114 && (
                <Link to={`/quran/${num + 1}`} className="btn-outline text-sm py-2 px-4">
                  التالية <FiArrowLeft size={13} className="inline mr-1" />
                </Link>
              )}
            </div>
          </div>

          {/* Ayahs */}
          <div className="max-w-3xl mx-auto px-4 pb-20 reading-mode">
            {arabicAyahs.map((ayah, i) => (
              <AyahCard
                key={ayah.number}
                ayah={{ ...ayah, audio: audioAyahs[i]?.audio }}
                translation={showTrans ? translationAyahs[i] : null}
                isBookmarked={isBookmarked(ayah.number)}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
