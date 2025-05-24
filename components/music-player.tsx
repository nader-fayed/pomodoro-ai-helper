"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Minimize2, Maximize2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MusicPlayerProps {
  className?: string
}

export function MusicPlayer({ className }: MusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={cn("bg-white/80 backdrop-blur-lg border-0 shadow-lg overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg bg-purple-100">
              <Music className="h-5 w-5 text-purple-500" />
            </motion.div>
            <div>
              <h2 className="font-medium">Focus Music</h2>
              <p className="text-sm text-gray-500">Enhance your concentration</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="h-5 w-5 text-gray-600" />
            ) : (
              <Maximize2 className="h-5 w-5 text-gray-600" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: isExpanded ? "352px" : "152px" }}
            transition={{ duration: 0.3 }}
            className="relative w-full overflow-hidden"
          >
            <iframe
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?"
              width="100%"
              height={isExpanded ? "352" : "152"}
              style={{ borderRadius: "12px" }}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

