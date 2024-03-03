import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Switch } from '@/components/ui/switch'

export function ThemeToggle() {
  const { systemTheme, theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkTheme = theme === 'dark'
  const currentThemeIcon = isDarkTheme ? <Moon size={24} /> : <Sun size={24} />
  const systemThemeIcon = systemTheme === 'dark' ? <Moon size={24} /> : <Sun size={24} />

  return (
    <Switch
      checked={isDarkTheme}
      onCheckedChange={(checked) => {
        setTheme(checked ? 'dark' : 'light')
      }}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'system' ? systemThemeIcon : currentThemeIcon}
    </Switch>
  )
}
