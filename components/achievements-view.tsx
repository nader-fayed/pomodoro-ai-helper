"use client"

import { motion } from "framer-motion"
import { Trophy, Lock, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AchievementsView() {
  const achievements = useStore((state) => state.achievements)
  const stats = useStore((state) => state.stats)

  // Group achievements by category
  const achievementCategories = {
    daily: achievements.filter((a) =>
      ["first_pomodoro", "pomodoro_rookie", "pomodoro_pro", "daily_dynamo"].includes(a.id),
    ),
    focus: achievements.filter((a) => ["focus_guru", "deep_work", "efficiency_master"].includes(a.id)),
    schedule: achievements.filter((a) => ["early_bird", "night_owl", "consistency_champion"].includes(a.id)),
    milestones: achievements.filter((a) => ["task_tamer", "marathoner", "productivity_legend"].includes(a.id)),
    special: achievements.filter((a) => ["achievement_collector", "pomodoro_champion"].includes(a.id)),
  }

  return (
    <Card className="w-full max-h-[85vh] overflow-hidden">
      <div className="p-6 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Achievements</h2>
        </div>
      </div>

      <ScrollArea className="h-[calc(85vh-80px)] p-6">
        <div className="grid gap-8">
          {Object.entries(achievementCategories).map(([category, categoryAchievements]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-medium capitalize sticky top-0 bg-white py-2">
                {category.replace("_", " ")} Achievements
              </h3>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categoryAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border-2",
                      achievement.unlockedAt
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-gray-50 hover:border-blue-200 transition-colors",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-full shrink-0",
                          achievement.unlockedAt ? "bg-yellow-100" : "bg-gray-100",
                        )}
                      >
                        {achievement.unlockedAt ? (
                          <CheckCircle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{achievement.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
                          <span className="text-sm font-medium text-yellow-600">{achievement.points} points</span>
                        </div>
                        {achievement.unlockedAt && (
                          <p className="text-xs text-yellow-600 mt-1">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        )}
                        {!achievement.unlockedAt && achievement.progress && (
                          <div className="mt-3">
                            <Progress value={achievement.progress(stats) * 100} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(achievement.progress(stats) * 100)}% complete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

