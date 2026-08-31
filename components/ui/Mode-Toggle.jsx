"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"

export function ModeToggle({ compact = false }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted ? resolvedTheme === "dark" : true

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "icon" : "default"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={compact ? "relative shrink-0" : "w-full justify-start gap-3"}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {!compact && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
    </Button>
  )
}
