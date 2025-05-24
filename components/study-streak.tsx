import { Flame } from "lucide-react"

interface StudyStreakProps {
  streak: number
}

export function StudyStreak({ streak }: StudyStreakProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="p-3 rounded-full bg-orange-100 mb-4">
        <Flame className="h-8 w-8 text-orange-500" />
      </div>
      <div className="text-3xl font-bold mb-2">{streak}</div>
      <div className="text-sm text-muted-foreground">Day Streak</div>
      <div className="mt-4 text-sm text-orange-600 font-medium">
        {streak > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
      </div>
    </div>
  )
}

