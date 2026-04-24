import { useEffect, useCallback } from 'react'
import { useAppStore } from '../store/appStore'

/**
 * useTheme — reads darkMode from the Zustand store, syncs it to
 * document.documentElement.classList ('dark' strategy), and
 * writes it to localStorage so the correct class is applied
 * BEFORE the first React render (via the inline script in index.html).
 */
export function useTheme() {
  const darkMode = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)

  // Sync class to <html> whenever darkMode changes
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
    // Also keep localStorage in sync (belt-and-suspenders alongside Zustand persist)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return { darkMode, toggleDarkMode }
}

/**
 * ThemeInitScript — call once at app start (before any render)
 * to apply the saved theme immediately and avoid FOUC.
 * Import and call this at the top of main.jsx / index.html.
 */
export function initTheme() {
  try {
    const saved = localStorage.getItem('theme')
    // Also check Zustand persisted store
    const zustandRaw = localStorage.getItem('islamic-app-storage')
    const zustandDark = zustandRaw ? JSON.parse(zustandRaw)?.state?.darkMode : undefined

    const isDark = saved
      ? saved === 'dark'
      : zustandDark !== undefined
        ? zustandDark
        : true // default: dark

    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  } catch (_) {
    document.documentElement.classList.add('dark')
  }
}
