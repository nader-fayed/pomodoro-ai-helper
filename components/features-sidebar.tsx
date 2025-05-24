"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Music, Trophy, ListTodo, StickyNote } from "lucide-react"
import { Notes } from "./notes"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MusicPlayer } from "./music-player"
import { AIChat } from "./ai-chat"
import { AchievementsView } from "./achievements-view"
import { TaskManager } from "./task-manager"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface FeaturesSidebarProps {
  className?: string
}

export function FeaturesSidebar({ className }: FeaturesSidebarProps) {
  const stats = useStore((state) => state.stats)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const features = [
    {
      id: "tasks",
      icon: ListTodo,
      title: "Tasks",
      component: <TaskManager />,
    },
    {
      id: "ai",
      icon: Brain,
      title: "AI Assistant",
      onClick: () => setShowAIChat(true),
    },
    {
      id: "music",
      icon: Music,
      title: "Focus Music",
      onClick: () => setShowMusicPlayer(true),
    },
    {
      id: "achievements",
      icon: Trophy,
      title: "Achievements",
      onClick: () => setShowAchievements(true),
    },
    {
      id: "notes",
      icon: StickyNote,
      title: "Notes",
      onClick: () => setShowNotes(true),
    },
  ]

  return (
    <>
      <div className={cn("w-full md:w-80 border-t md:border-l bg-white/50 backdrop-blur-sm p-6", className)}>
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) =>
                feature.component ? (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="col-span-2"
                  >
                    {feature.component}
                  </motion.div>
                ) : (
                  <motion.button
                    key={feature.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={feature.onClick}
                    className="h-24 flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <feature.icon className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="text-sm font-medium">{feature.title}</span>
                  </motion.button>
                ),
              )}
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div>
            <h3 className="font-semibold mb-4">Your Progress</h3>
            <div className="space-y-4">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Focus Score</span>
                  <span className="text-sm font-medium">{stats.focusScore}%</span>
                </div>
                <Progress value={stats.focusScore} className="h-2" />
              </motion.div>

              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.3 }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Study Streak</span>
                  <span className="text-sm font-medium">{stats.studyStreak} days</span>
                </div>
                <Progress value={(stats.studyStreak / 30) * 100} className="h-2" />
              </motion.div>

              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.4 }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Level Progress</span>
                  <span className="text-sm font-medium">Level {stats.level}</span>
                </div>
                <Progress value={(stats.xp % 1000) / 10} className="h-2" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Music Player Dialog */}
      <Dialog open={showMusicPlayer} onOpenChange={setShowMusicPlayer}>
        <DialogContent className="max-w-2xl p-0 bg-transparent border-none">
          <MusicPlayer />
        </DialogContent>
      </Dialog>

      {/* AI Chat Dialog */}
      <AIChat open={showAIChat} onOpenChange={setShowAIChat} />

      {/* Achievements Dialog */}
      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="max-w-[90vw] w-[1200px] p-0">
          <AchievementsView />
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Notes open={showNotes} onOpenChange={setShowNotes} />
    </>
  )
}

