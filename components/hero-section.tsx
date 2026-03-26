"use client"

import * as React from "react"
import { Shield, Zap, Globe, Lock, Server, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Edge-optimized servers for sub-50ms response times worldwide",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Zero-log policy with end-to-end encryption on all connections",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "6+ server locations across North America, Europe, and Asia",
  },
]

export function HeroSection() {
  return (
    <div className="text-center space-y-8">
      {/* Logo and title */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Server className="relative size-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          <span className="text-foreground">Browse the web</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
            privately & fast
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
          High-performance proxy with enterprise-grade encryption. 
          No logs, no tracking, no limits.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: Lock, label: "256-bit Encryption" },
          { icon: Eye, label: "No Logs" },
          { icon: Zap, label: "< 50ms Latency" },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-muted/50 border border-border/50",
              "text-sm text-muted-foreground"
            )}
          >
            <item.icon className="size-4 text-primary" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto mt-16">
      {FEATURES.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            "group relative p-6 rounded-xl",
            "glass hover:bg-accent/30 transition-all duration-300",
            "hover:scale-[1.02] hover:shadow-lg"
          )}
        >
          <div className="space-y-3">
            <div
              className={cn(
                "inline-flex items-center justify-center w-10 h-10 rounded-lg",
                "bg-primary/10 text-primary",
                "group-hover:bg-primary group-hover:text-primary-foreground",
                "transition-colors duration-300"
              )}
            >
              <feature.icon className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
