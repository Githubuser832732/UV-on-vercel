"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface QuickSite {
  name: string
  url: string
  icon: string
  color: string
}

const QUICK_SITES: QuickSite[] = [
  { name: "Google", url: "https://google.com", icon: "G", color: "bg-blue-500" },
  { name: "YouTube", url: "https://youtube.com", icon: "Y", color: "bg-red-500" },
  { name: "Wikipedia", url: "https://wikipedia.org", icon: "W", color: "bg-neutral-600" },
  { name: "Reddit", url: "https://reddit.com", icon: "R", color: "bg-orange-500" },
  { name: "GitHub", url: "https://github.com", icon: "G", color: "bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-800" },
  { name: "Twitter", url: "https://x.com", icon: "X", color: "bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900" },
]

interface QuickAccessProps {
  onSelect: (url: string) => void
}

export function QuickAccess({ onSelect }: QuickAccessProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Quick Access
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {QUICK_SITES.map((site) => (
          <button
            key={site.name}
            onClick={() => onSelect(site.url)}
            className={cn(
              "group flex flex-col items-center gap-2 p-3 rounded-lg",
              "glass hover:bg-accent/50 transition-all duration-200",
              "hover:scale-105 active:scale-95"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                "text-white font-bold text-sm",
                "shadow-md transition-transform duration-200",
                "group-hover:shadow-lg",
                site.color
              )}
            >
              {site.icon}
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {site.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
