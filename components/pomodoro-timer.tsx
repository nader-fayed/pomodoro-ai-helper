"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function PomodoroTimer() {
  const { currentTask, isTimerActive, toggleTimer, completeTask, updateTask } = useStore()
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    if (currentTask) {
      setTimeElapsed(0)
      setProgress(0)
      toggleTimer(false)
    }
  }, [currentTask, toggleTimer])

  const calculateTimeEfficiency = useCallback(() => {
    if (!timeElapsed) return 0
    const totalSessionTime = currentTask ? currentTask.duration * 60 : 25 * 60
    const efficiency = (timeElapsed / totalSessionTime) * 100
    return Math.round(Math.min(efficiency, 100))
  }, [timeElapsed, currentTask])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeElapsed((time) => {
          const newTime = time + 1
          const totalTime = currentTask ? currentTask.duration * 60 : 25 * 60
          setProgress((newTime / totalTime) * 100)
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, currentTask])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetTimer = () => {
    toggleTimer(false)
    setTimeElapsed(0)
    setProgress(0)
    setShowComplete(false)
  }

  const handleFinish = () => {
    toggleTimer(false)
    setShowComplete(true)
    if (currentTask) {
      const efficiency = calculateTimeEfficiency()
      completeTask(currentTask.id, efficiency)
      // Update task efficiency
      updateTask(currentTask.id, { efficiency })
    }
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg z-10"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block p-3 rounded-full bg-green-100 mb-4"
              >
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Great job!</h3>
              <p className="text-sm text-muted-foreground mb-4">You've completed your focus session</p>
              <Button onClick={resetTimer}>Start New Session</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[min(100vw,500px)] mx-auto mb-8">
        <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
          <svg className="w-full h-full -rotate-90 transform">
            <circle cx="50%" cy="50%" r="45%" className="stroke-slate-200 fill-none" strokeWidth="8%" />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-blue-600 fill-none"
              strokeWidth="8%"
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={timeElapsed}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold font-mono"
            >
              {formatTime(timeElapsed)}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={() => toggleTimer(!isTimerActive)}
            className={cn(
              "h-14 px-6 text-lg",
              isTimerActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700",
            )}
          >
            {isTimerActive ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
            {isTimerActive ? "Pause" : "Start"}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" variant="outline" onClick={resetTimer} className="h-14 px-6 text-lg">
            <RotateCcw className="h-6 w-6 mr-2" />
            Reset
          </Button>
        </motion.div>
        {isTimerActive && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" onClick={handleFinish} className="h-14 px-6 text-lg bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-6 w-6 mr-2" />
              Finish
            </Button>
          </motion.div>
        )}
      </div>

      {currentTask && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
          <h3 className="text-lg font-medium">{currentTask.title}</h3>
          <p className="text-sm text-muted-foreground">Focus session: {currentTask.duration} minutes</p>
        </motion.div>
      )}
    </div>
  )
}

