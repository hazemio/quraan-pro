import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Bookmarks
      bookmarkedAyahs: [],
      addBookmark: (ayah) => {
        const exists = get().bookmarkedAyahs.find(b => b.number === ayah.number)
        if (!exists) set((s) => ({ bookmarkedAyahs: [...s.bookmarkedAyahs, ayah] }))
      },
      removeBookmark: (number) =>
        set((s) => ({ bookmarkedAyahs: s.bookmarkedAyahs.filter(b => b.number !== number) })),
      isBookmarked: (number) => get().bookmarkedAyahs.some(b => b.number === number),

      // Favorite Hadiths
      favoriteHadiths: [],
      addFavoriteHadith: (hadith) => {
        const exists = get().favoriteHadiths.find(h => h.id === hadith.id)
        if (!exists) set((s) => ({ favoriteHadiths: [...s.favoriteHadiths, hadith] }))
      },
      removeFavoriteHadith: (id) =>
        set((s) => ({ favoriteHadiths: s.favoriteHadiths.filter(h => h.id !== id) })),
      isFavoriteHadith: (id) => get().favoriteHadiths.some(h => h.id === id),

      // Recently Viewed Surahs
      recentSurahs: [],
      addRecentSurah: (surah) => {
        const filtered = get().recentSurahs.filter(s => s.number !== surah.number)
        set({ recentSurahs: [surah, ...filtered].slice(0, 5) })
      },

      // Tasbeeh Counter
      tasbeehCount: 0,
      tasbeehTarget: 33,
      tasbeehLabel: 'سبحان الله',
      incrementTasbeeh: () => {
        const count = get().tasbeehCount + 1
        set({ tasbeehCount: count })
        return count
      },
      resetTasbeeh: () => set({ tasbeehCount: 0 }),
      setTasbeehConfig: (label, target) => set({ tasbeehLabel: label, tasbeehTarget: target, tasbeehCount: 0 }),

      // Last Read
      lastRead: null,
      setLastRead: (data) => set({ lastRead: data }),

      // Azkar progress
      azkarProgress: {},
      incrementAzkar: (id) => {
        const current = get().azkarProgress[id] || 0
        set((s) => ({ azkarProgress: { ...s.azkarProgress, [id]: current + 1 } }))
      },
      resetAzkarProgress: () => set({ azkarProgress: {} }),
    }),
    {
      name: 'islamic-app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        bookmarkedAyahs: state.bookmarkedAyahs,
        favoriteHadiths: state.favoriteHadiths,
        recentSurahs: state.recentSurahs,
        tasbeehCount: state.tasbeehCount,
        tasbeehTarget: state.tasbeehTarget,
        tasbeehLabel: state.tasbeehLabel,
        lastRead: state.lastRead,
        azkarProgress: state.azkarProgress,
      }),
    }
  )
)
