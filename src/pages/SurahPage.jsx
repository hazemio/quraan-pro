import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAppStore } from '../store/appStore'
import {
  PageTransition, AyahSkeleton, ErrorMessage, PageLoader, GeometricBackground
} from '../components/common/index.jsx'
import {
  FiBookmark, FiPlay, FiPause, FiArrowRight, FiArrowLeft,
  FiMaximize2, FiMinimize2, FiShare2
} from 'react-icons/fi'

function AyahCard({ ayah, translation, isBookmarked, onBookmark, surahName }) {
  const [showTranslation, setShowTranslation] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleAudio = () => {
    if (!ayah.audio) return
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause()
        setAudioPlaying(false)
      } else {
        audioRef.current.play()
        setAudioPlaying(true)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-4 group"
      style={{ borderColor: isBookmarked ? 'rgba(212,175,55,0.5)' : 'rgba(30,58,90,0.8)' }}
    >
      {/* Ayah Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-cairo text-sm font-bold"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
        >
          {ayah.numberInSurah}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {ayah.audio && (
            <>
              <audio
                ref={audioRef}
                src={ayah.audio}
                onEnded={() => setAudioPlaying(false)}
              />
              <button
                onClick={toggleAudio}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-islamic-card"
                style={{ color: '#D4AF37' }}
              >
                {audioPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
              </button>
            </>
          )}
          <button
            onClick={() => onBookmark(ayah)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-islamic-card"
            style={{ color: isBookmarked ? '#D4AF37' : '#6b7280' }}
          >
            <FiBookmark size={14} fill={isBookmarked ? '#D4AF37' : 'none'} />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <div
        className="ayah-text text-right mb-4 leading-loose"
        style={{ fontFamily: 'Amiri, serif' }}
      >
        {ayah.text}
        <span className="text-gold-500 mx-2" style={{ fontSize: '1.2rem' }}>
          ﴿{ayah.numberInSurah}﴾
        </span>
      </div>

      {/* Translation */}
      {showTranslation && translation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t pt-4 mt-4"
          style={{ borderColor: 'rgba(30,58,90,0.8)' }}
        >
          <p className="text-gray-400 font-cairo text-sm leading-relaxed text-left" dir="ltr">
            {translation.text}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function SurahPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [surah, setSurah] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [focusMode, setFocusMode] = useState(false)
  const [showTranslation, setShowTranslation] = useState(true)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const { addBookmark, removeBookmark, isBookmarked, addRecentSurah, setLastRead } = useAppStore()

  const fetchSurah = async () => {
    setLoading(true)
    setError(null)
    try {
      const [arabicRes, audioRes] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad,ar.alafasy`),
        axios.get(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`).catch(() => null),
      ])

      const [arabic, translation, audio] = arabicRes.data.data
      setSurah({ arabic, translation, audio })

      if (arabic) {
        addRecentSurah({ number: arabic.number, name: arabic.name })
        setLastRead({ surahNumber: arabic.number, surahName: arabic.name })
      }
    } catch (e) {
      setError('تعذر تحميل السورة')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSurah() }, [id])

  const handleBookmark = (ayah) => {
    const bookmarkData = {
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      surahNumber: surah?.arabic?.number,
      surahName: surah?.arabic?.name,
    }
    if (isBookmarked(ayah.number)) {
      removeBookmark(ayah.number)
    } else {
      addBookmark(bookmarkData)
    }
  }

  const toggleFullAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const num = parseInt(id)

  if (loading) return (
    <div className="pt-24 max-w-3xl mx-auto px-4">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <AyahSkeleton key={i} />)}
      </div>
    </div>
  )

  if (error) return (
    <div className="pt-32 flex items-center justify-center">
      <ErrorMessage message={error} onRetry={fetchSurah} />
    </div>
  )

  const arabicAyahs = surah?.arabic?.ayahs || []
  const translationAyahs = surah?.translation?.ayahs || []
  const audioAyahs = surah?.audio?.ayahs || []

  return (
    <PageTransition>
      <div className={`relative min-h-screen ${focusMode ? 'focus-mode' : ''}`}>
        {!focusMode && <GeometricBackground />}

        <div className={`relative z-10 ${focusMode ? 'pt-4' : 'pt-20'}`}>
          {/* Navigation Bar */}
          <div
            className="sticky top-16 z-40 py-3 px-4 mb-4"
            style={{
              background: focusMode
                ? 'rgba(6,14,26,0.99)'
                : 'rgba(6,14,26,0.92)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(212,175,55,0.1)',
            }}
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/quran')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center glass-card hover:scale-105 transition-all"
                  style={{ color: '#D4AF37' }}
                >
                  <FiArrowRight size={18} />
                </button>
                <div>
                  <div className="font-cairo font-bold text-white leading-none">
                    {surah?.arabic?.englishName}
                  </div>
                  <div className="text-xs text-gray-500 font-cairo">
                    {arabicAyahs.length} آية
                  </div>
                </div>
              </div>

              <div
                className="font-arabic text-2xl"
                style={{ color: '#D4AF37' }}
              >
                {surah?.arabic?.name}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-3 py-1.5 rounded-lg font-cairo text-xs transition-all ${showTranslation ? 'text-islamic-darker font-semibold' : 'glass-card text-gray-400'}`}
                  style={showTranslation ? { background: 'linear-gradient(135deg, #D4AF37, #f0d060)' } : {}}
                >
                  ترجمة
                </button>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center glass-card hover:scale-105 transition-all"
                  style={{ color: '#D4AF37' }}
                >
                  {focusMode ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Surah Header */}
          <div className="text-center py-8 max-w-3xl mx-auto px-4">
            {surah?.arabic?.number !== 1 && surah?.arabic?.number !== 9 && (
              <div
                className="font-arabic text-3xl mb-4"
                style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.3)' }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </div>
            )}

            {/* Audio Player */}
            <div className="glass-card inline-flex items-center gap-4 px-6 py-3 rounded-2xl mb-6"
              style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              <button
                onClick={toggleFullAudio}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)', color: '#060e1a' }}
              >
                {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
              </button>
              <div className="font-cairo text-sm text-gray-300">
                <div>استماع كامل للسورة</div>
                <div className="text-xs text-gray-500">الشيخ مشاري العفاسي</div>
              </div>
            </div>

            {/* Nav between surahs */}
            <div className="flex items-center justify-center gap-4">
              {num > 1 && (
                <Link to={`/quran/${num - 1}`} className="btn-outline text-sm py-2 px-4">
                  <FiArrowRight size={14} className="inline ml-1" />
                  السابقة
                </Link>
              )}
              {num < 114 && (
                <Link to={`/quran/${num + 1}`} className="btn-outline text-sm py-2 px-4">
                  التالية
                  <FiArrowLeft size={14} className="inline mr-1" />
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
                translation={showTranslation ? translationAyahs[i] : null}
                isBookmarked={isBookmarked(ayah.number)}
                onBookmark={handleBookmark}
                surahName={surah?.arabic?.name}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
