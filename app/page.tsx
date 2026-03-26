"use client"

import * as React from "react"
import { Header } from "@/components/header"
import { BackgroundGrid } from "@/components/background-grid"
import { HeroSection, FeatureCards } from "@/components/hero-section"
import { ProxySearch } from "@/components/proxy-search"
import { QuickAccess } from "@/components/quick-access"
import { ServerSettings } from "@/components/server-settings"

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleProxySubmit = (url: string) => {
    setIsLoading(true)
    
    // Process the URL
    let processedUrl = url.trim()
    
    // If it doesn't look like a URL, treat it as a search query
    if (!processedUrl.includes(".") || processedUrl.includes(" ")) {
      processedUrl = `https://www.google.com/search?q=${encodeURIComponent(processedUrl)}`
    } else if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = `https://${processedUrl}`
    }
    
    // Simulate loading then redirect to the proxy
    setTimeout(() => {
      // In a real implementation, this would use the UV proxy encoding
      // For now, we'll just open the URL
      if (typeof window !== "undefined" && window.__uv$config) {
        const encodedUrl = window.__uv$config.prefix + window.__uv$config.encodeUrl(processedUrl)
        window.location.href = encodedUrl
      } else {
        // Fallback for demo - just log it
        console.log("Would proxy to:", processedUrl)
        setIsLoading(false)
      }
    }, 500)
  }

  const handleQuickAccess = (url: string) => {
    handleProxySubmit(url)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundGrid />
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Search Bar */}
          <div className="space-y-6">
            <ProxySearch onSubmit={handleProxySubmit} isLoading={isLoading} />
          </div>
          
          {/* Quick Access */}
          <QuickAccess onSelect={handleQuickAccess} />
          
          {/* Server Settings */}
          <ServerSettings />
          
          {/* Feature Cards */}
          <FeatureCards />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 Prism. Privacy-focused web proxy.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Extend Window interface for UV proxy config
declare global {
  interface Window {
    __uv$config?: {
      prefix: string
      encodeUrl: (url: string) => string
    }
  }
}
