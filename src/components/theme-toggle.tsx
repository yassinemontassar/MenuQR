import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Switch } from '@/components/ui/switch'
import Image from 'next/image'

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
    <button
    aria-label="theme toggler"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className=" bg-gray-2 dark:bg-dark-bg  flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white lg:static"
  >
    <Image
      src="/images/icon/icon-moon.svg"
      alt="logo"
      width={21}
      height={21}
      priority
      className="dark:hidden"
    />

    <Image
      src="/images/icon/icon-sun.svg"
      alt="logo"
      width={22}
      height={22}
      priority
      className="hidden dark:block"
    />
  </button>
  )
}
