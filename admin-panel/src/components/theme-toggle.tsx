import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-16 h-8" /> // Placeholder to prevent layout shift
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-card/80 backdrop-blur-md border border-border/50 rounded-full px-4 py-2 shadow-soft">
      <Sun className={`w-4 h-4 transition-colors duration-300 ${!isDark ? 'text-primary' : 'text-muted-foreground'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
      />
      <Moon className={`w-4 h-4 transition-colors duration-300 ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  )
}