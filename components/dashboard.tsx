'use client'

import { useState, useEffect } from "react"
import { Eye, Trophy, Flame, EyeOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PomodoroTimer } from "./pomodoro-timer"
import { TaskList } from "./task-list"
import { FocusMetrics } from "./focus-metrics"
import { StudyStreak } from "./study-streak"
import { AIChat } from "./ai-chat"
import { Notes } from "./notes"
import { FeaturesSidebar } from "./features-sidebar"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Dashboard() {
  const { stats, updateStats, checkAchievements } = useStore()
  const [focusScore, setFocusScore] = useState(0)
  const [studyStreak, setStudyStreak] = useState(0)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<any>(null)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const handleFocusModeChange = (active: boolean) => setIsFocusMode(active)

  const handleTaskComplete = (taskDuration: number, actualDuration: number) => {
    const baseXP = 50
    const focusBonus = Math.max(0, ((taskDuration - actualDuration) / taskDuration) * 50)
    const earnedXP = Math.round(baseXP + focusBonus)
    const currentFocusScore = Math.min(100, focusScore + 5)

    setFocusScore((prev) => Math.min(100, prev + 5))
    setStudyStreak((prev) => prev + 1)

    updateStats({
      duration: taskDuration,
      focusScore: currentFocusScore,
      xp: stats.xp + earnedXP
    })
  }

  useEffect(() => {
    checkAchievements()
  }, [focusScore, studyStreak, checkAchievements])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex flex-col md:flex-row">
        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 bg-white/50 backdrop-blur-sm border-b gap-4">
            <div className="flex items-center gap-3">
              <img src="/brain-clock-logo.svg" alt="Brain Clock Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-semibold text-center sm:text-left">FocusQuest</h1>
                <p className="text-sm text-muted-foreground text-center sm:text-left">Your study session dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">

              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">{stats.xp} XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{studyStreak} Streak</span>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="p-4 sm:p-8 space-y-6">
            {/* Timer and Current Task */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2 p-6 bg-white/50 backdrop-blur-sm">
                <PomodoroTimer currentTask={currentTask} onComplete={handleTaskComplete} />
              </Card>
              <Card className="p-6 bg-white/50 backdrop-blur-sm">
                <StudyStreak streak={studyStreak} />
              </Card>
            </div>

            {/* Tasks and Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <Card className="p-6 bg-white/50 backdrop-blur-sm">
                  <TaskList onTaskSelect={setCurrentTask} currentTask={currentTask} />
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="p-6 bg-white/50 backdrop-blur-sm">
                  <FocusMetrics
                    focusScore={focusScore}
                    tasksCompleted={studyStreak}
                    totalStudyTime={studyStreak * 25}
                    isFocusMode={isFocusMode}
                    onFocusModeChange={handleFocusModeChange}
                  />
                </Card>
                {!isFocusMode && <Notes />}
              </div>
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        {!isFocusMode && (
          <FeaturesSidebar
            onOpenAIChat={() => setIsAIChatOpen(true)}
            focusScore={focusScore}
            studyStreak={studyStreak}
            xp={stats.xp}
          />
        )}
      </div>

      {/* AI Chat Dialog */}
      {!isFocusMode && <AIChat open={isAIChatOpen} onOpenChange={setIsAIChatOpen} />}
    </div>
  )
}

