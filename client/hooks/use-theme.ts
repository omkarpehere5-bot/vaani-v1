import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then default to light
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  return {
    theme,
    setTheme,
  }
}
