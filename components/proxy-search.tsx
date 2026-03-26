"use client"

import * as React from "react"
import { ArrowRight, Globe, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProxySearchProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
}

export function ProxySearch({ onSubmit, isLoading = false }: ProxySearchProps) {
  const [url, setUrl] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "relative flex items-center rounded-xl transition-all duration-300",
          "glass-strong glow-primary",
          "focus-within:ring-2 focus-within:ring-primary/50",
          "p-1.5"
        )}
      >
        <div className="flex items-center justify-center w-12 h-12">
          <Globe className="size-5 text-muted-foreground" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL or search query..."
          className={cn(
            "flex-1 bg-transparent border-none outline-none",
            "text-base text-foreground placeholder:text-muted-foreground",
            "px-2 py-3 font-mono"
          )}
          disabled={isLoading}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        
        <div className="flex items-center gap-2 pr-1">
          <div className="hidden sm:block h-8 w-px bg-border" />
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !url.trim()}
            className={cn(
              "h-11 px-6 rounded-lg gap-2 font-semibold",
              "bg-primary hover:bg-primary/90",
              "shadow-lg shadow-primary/25 transition-all duration-200",
              "disabled:shadow-none"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="hidden sm:inline">Loading</span>
              </>
            ) : (
              <>
                <span>Go</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
        <Search className="size-3" />
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">
          Enter
        </kbd>
        <span>to browse</span>
      </div>
    </form>
  )
}
