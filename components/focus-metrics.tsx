import { Clock, Target, Trophy, Eye, EyeOff } from "lucide-react"
import { useStore } from "../lib/store"
import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

interface FocusMetricsProps {
  focusScore: number
  tasksCompleted: number
  totalStudyTime: number
  isFocusMode: boolean
  onFocusModeChange: (active: boolean) => void
}

export function FocusMetrics({
  focusScore,
  tasksCompleted,
  totalStudyTime,
  isFocusMode,
  onFocusModeChange
}: FocusMetricsProps) {
  const stats = useStore((state) => state.stats)

  return (
    <div className={cn("space-y-6", isFocusMode && "relative")}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">Focus Metrics</h3>
        </div>
        <Button
          variant="outline"
          className={cn(
            "transition-colors flex items-center gap-2",
            isFocusMode ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-blue-50"
          )}
          onClick={() => onFocusModeChange(!isFocusMode)}
        >
          {isFocusMode ? (
            <>
              <EyeOff className="h-4 w-4" /> Show All
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> Focus Mode
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className={cn(
          "transition-all duration-300",
          isFocusMode && "blur-[2px] hover:blur-none"
        )}>
          <div className="w-full flex items-center gap-4 h-auto p-4 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-lg bg-blue-100">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-2xl font-bold">{focusScore}%</div>
              <div className="text-sm text-muted-foreground">Focus Score</div>
            </div>
          </div>
        </div>

        <div className={cn(
          "transition-all duration-300",
          isFocusMode && "blur-[2px] hover:blur-none"
        )}>
          <div className="w-full flex items-center gap-4 h-auto p-4 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-lg bg-green-100">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-2xl font-bold">{tasksCompleted}</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
          </div>
        </div>

        <div className={cn(
          "transition-all duration-300",
          isFocusMode && "blur-[2px] hover:blur-none"
        )}>
          <div className="w-full flex items-center gap-4 h-auto p-4 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-lg bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-2xl font-bold">{totalStudyTime}m</div>
              <div className="text-sm text-muted-foreground">Total FocusQuest</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

