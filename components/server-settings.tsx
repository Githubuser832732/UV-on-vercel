"use client"

import * as React from "react"
import { MapPin, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Server {
  id: string
  name: string
  region: string
  flag: string
  latency: number
}

const SERVERS: Server[] = [
  { id: "us-east", name: "US East", region: "New York", flag: "🇺🇸", latency: 12 },
  { id: "us-west", name: "US West", region: "Los Angeles", flag: "🇺🇸", latency: 45 },
  { id: "eu-west", name: "EU West", region: "London", flag: "🇬🇧", latency: 78 },
  { id: "eu-central", name: "EU Central", region: "Frankfurt", flag: "🇩🇪", latency: 92 },
  { id: "asia-east", name: "Asia East", region: "Tokyo", flag: "🇯🇵", latency: 156 },
  { id: "asia-south", name: "Asia South", region: "Singapore", flag: "🇸🇬", latency: 189 },
]

interface ServerSettingsProps {
  onServerChange?: (server: Server) => void
}

export function ServerSettings({ onServerChange }: ServerSettingsProps) {
  const [selectedServer, setSelectedServer] = React.useState<Server>(SERVERS[0])
  const [isOpen, setIsOpen] = React.useState(false)

  const handleServerChange = (serverId: string) => {
    const server = SERVERS.find((s) => s.id === serverId)
    if (server) {
      setSelectedServer(server)
      onServerChange?.(server)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg",
          "glass hover:bg-accent/30 transition-all duration-200",
          "text-sm"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
            <Settings className="size-4" />
          </div>
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Server Region</div>
            <div className="font-medium flex items-center gap-2">
              <span>{selectedServer.flag}</span>
              <span>{selectedServer.name}</span>
              <span className="text-xs text-muted-foreground">
                ({selectedServer.latency}ms)
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-2 p-2 rounded-lg glass animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {SERVERS.map((server) => (
              <button
                key={server.id}
                onClick={() => {
                  handleServerChange(server.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md",
                  "hover:bg-accent/50 transition-colors",
                  selectedServer.id === server.id && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{server.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium">{server.name}</div>
                    <div className="text-xs text-muted-foreground">{server.region}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      server.latency < 50
                        ? "bg-green-500"
                        : server.latency < 100
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                    )}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {server.latency}ms
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
