import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, StudySession, UserStats } from "./types"

interface Achievement {
  id: string
  name: string
  description: string
  points: number
  condition: (stats: UserStats) => boolean
  progress?: (stats: UserStats) => number
  unlockedAt?: Date
}

interface StoreState {
  tasks: Task[]
  sessions: StudySession[]
  stats: UserStats
  currentTask: Task | null
  isTimerActive: boolean
  settings: {
    soundEnabled: boolean
    notifications: boolean
    theme: "light" | "dark"
  }
  achievements: Achievement[]
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => void
  completeTask: (taskId: number, focusScore: number) => void
  updateTask: (taskId: number, updatedTask: Partial<Task>) => void
  deleteTask: (taskId: number) => void
  setCurrentTask: (task: Task | null) => void
  updateStats: (sessionData: { duration: number; focusScore: number }) => void
  toggleTimer: (active: boolean) => void
  updateSettings: (settings: Partial<StoreState["settings"]>) => void
  checkAchievements: () => void
}

const showAchievementNotification = (achievement: Achievement) => {
  // Implementation for showing achievement notification
  console.log("Achievement unlocked:", achievement.name)
}

const achievements: Achievement[] = [
  {
    id: "first_pomodoro",
    name: "First Pomodoro",
    description: "Complete your very first 25‑minute session.",
    points: 10,
    condition: (stats) => stats.totalStudyTime >= 25,
  },
  {
    id: "pomodoro_rookie",
    name: "Pomodoro Rookie",
    description: "Complete 5 study sessions.",
    points: 20,
    condition: (stats) => stats.tasksCompleted >= 5,
    progress: (stats) => Math.min(stats.tasksCompleted / 5, 1),
  },
  {
    id: "pomodoro_pro",
    name: "Pomodoro Pro",
    description: "Complete 10 study sessions.",
    points: 30,
    condition: (stats) => stats.tasksCompleted >= 10,
    progress: (stats) => Math.min(stats.tasksCompleted / 10, 1),
  },
  {
    id: "focus_guru",
    name: "Focus Guru",
    description: "Achieve a focus score of 90% or higher.",
    points: 25,
    condition: (stats) => stats.bestFocusScore >= 90,
    progress: (stats) => Math.min(stats.bestFocusScore / 90, 1),
  },
  {
    id: "xp_collector",
    name: "XP Collector",
    description: "Earn 500 XP points.",
    points: 40,
    condition: (stats) => stats.xp >= 500,
    progress: (stats) => Math.min(stats.xp / 500, 1),
  },
  {
    id: "consistency_champion",
    name: "Consistency Champion",
    description: "Maintain a study streak for 7 consecutive days.",
    points: 50,
    condition: (stats) => stats.studyStreak >= 7,
    progress: (stats) => Math.min(stats.studyStreak / 7, 1),
  },
  {
    id: "efficiency_master",
    name: "Efficiency Master",
    description: "Maintain an average efficiency of 85% or higher.",
    points: 35,
    condition: (stats) => stats.averageEfficiency >= 85,
    progress: (stats) => Math.min(stats.averageEfficiency / 85, 1),
  },
  {
    id: "level_up",
    name: "Night Owl",
    description: "Complete 5 Pomodoro sessions between 11 PM and 5 AM in one day.",
    points: 20,
    condition: (stats) => stats.nightOwlSessions >= 5,
    progress: (stats) => Math.min(stats.nightOwlSessions / 5, 1),
  },
  {
    id: "task_tamer",
    name: "Task Tamer",
    description: "Finish a task that requires 4 or more Pomodoros.",
    points: 30,
    condition: (stats) => stats.longestTask >= 4,
    progress: (stats) => Math.min(stats.longestTask / 4, 1),
  },
  {
    id: "deep_work",
    name: "Deep Work",
    description: "Complete a session with 100% focus for the full 25 minutes.",
    points: 40,
    condition: (stats) => stats.deepWorkSessions >= 1,
  },
  {
    id: "efficiency_master",
    name: "Efficiency Master",
    description: "Maintain an average session efficiency of 95% or higher over an entire week.",
    points: 50,
    condition: (stats) => stats.weeklyAverageEfficiency >= 95,
    progress: (stats) => Math.min(stats.weeklyAverageEfficiency / 95, 1),
  },
  {
    id: "marathoner",
    name: "Marathoner",
    description: "Accumulate 100 hours of focused work (tracked over sessions).",
    points: 100,
    condition: (stats) => stats.totalStudyTime >= 100 * 60,
    progress: (stats) => Math.min(stats.totalStudyTime / (100 * 60), 1),
  },
  {
    id: "productivity_legend",
    name: "Productivity Legend",
    description: "Reach 1,000 total Pomodoro sessions.",
    points: 200,
    condition: (stats) => stats.totalPomodoroSessions >= 1000,
    progress: (stats) => Math.min(stats.totalPomodoroSessions / 1000, 1),
  },
  {
    id: "achievement_collector",
    name: "Achievement Collector",
    description: "Unlock every achievement available in a single month.",
    points: 300,
    condition: (stats) => {
      // This condition needs to be implemented based on how you track monthly achievements
      // For now, it's set to false as a placeholder
      return false
    },
  },
  {
    id: "pomodoro_champion",
    name: "Pomodoro Champion",
    description: "Earn the highest monthly productivity score in a peer challenge.",
    points: 250,
    condition: (stats) => {
      // This condition needs to be implemented based on how you track peer challenges
      // For now, it's set to false as a placeholder
      return false
    },
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      sessions: [],
      stats: {
        level: 1,
        xp: 0,
        focusScore: 0,
        studyStreak: 0,
        totalStudyTime: 0,
        tasksCompleted: 0,
        averageEfficiency: 0,
        totalBreaks: 0,
        bestFocusScore: 0,
        weeklyStudyTime: [0, 0, 0, 0, 0, 0, 0],
      },
      currentTask: null,
      isTimerActive: false,
      settings: {
        soundEnabled: true,
        notifications: true,
        theme: "light",
      },
      achievements: achievements.map((a) => ({ ...a, unlockedAt: undefined })),

      addTask: (taskData) => {
        const task: Task = {
          id: Date.now(),
          completed: false,
          createdAt: new Date(),
          ...taskData,
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
      },

      completeTask: (taskId, focusScore) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { 
              ...task, 
              completed: true, 
              completedAt: new Date(),
              efficiency: focusScore, // Store the efficiency score
              actualDuration: task.duration // Store actual duration
            } : task,
          ),
          currentTask: null,
        }))

        const task = get().tasks.find((t) => t.id === taskId)
        if (task) {
          get().updateStats({
            duration: task.duration,
            focusScore,
          })
        }
      },

      updateTask: (taskId, updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
        }))
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }))
      },

      setCurrentTask: (task) => {
        set({ currentTask: task })
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      checkAchievements: () => {
        const { stats, achievements } = get()
        let totalNewXP = 0
        const updatedAchievements = achievements.map((achievement) => {
          try {
            if (!achievement.unlockedAt && achievement.condition && achievement.condition(stats)) {
              showAchievementNotification(achievement)
              totalNewXP += achievement.points
              return { ...achievement, unlockedAt: new Date() }
            }
          } catch (error) {
            console.error(`Error checking achievement ${achievement.id}:`, error)
          }
          return achievement
        })
        if (totalNewXP > 0) {
          set({
            achievements: updatedAchievements,
            stats: {
              ...stats,
              xp: stats.xp + totalNewXP
            }
          })
        } else {
          set({ achievements: updatedAchievements })
        }
      },

      updateStats: ({ duration, focusScore }) => {
        set((state) => {
          const efficiency = (focusScore / 100) * 100
          const xpGained = Math.round(duration * (focusScore / 100))
          const newXP = state.stats.xp + xpGained
          const newLevel = Math.floor(newXP / 1000) + 1

          // Check if the last study session was yesterday or today
          const lastStudyDate = new Date(state.stats.lastStudyDate || 0)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          const isConsecutiveDay = 
            today.toDateString() === lastStudyDate.toDateString() ||
            yesterday.toDateString() === lastStudyDate.toDateString()

          const newStreak = isConsecutiveDay ? state.stats.studyStreak + 1 : 1

          const weeklyStudyTime = [...state.stats.weeklyStudyTime]
          weeklyStudyTime[today.getDay()] = (weeklyStudyTime[today.getDay()] || 0) + duration

          const hour = today.getHours()
          const isEarlyBird = hour >= 5 && hour < 9
          const isNightOwl = hour >= 23 || hour < 5

          const newStats = {
            ...state.stats,
            level: newLevel,
            xp: newXP,
            focusScore: Math.round((state.stats.focusScore + focusScore) / 2),
            studyStreak: newStreak,
            lastStudyDate: today,
            totalStudyTime: state.stats.totalStudyTime + duration,
            tasksCompleted: state.stats.tasksCompleted + 1,
            averageEfficiency: Math.round(
              (state.stats.averageEfficiency * state.stats.tasksCompleted + efficiency) /
                (state.stats.tasksCompleted + 1),
            ),
            totalBreaks: state.stats.totalBreaks + Math.floor(duration / 25),
            bestFocusScore: Math.max(state.stats.bestFocusScore, focusScore),
            weeklyStudyTime,
            totalPomodoroSessions: (state.stats.totalPomodoroSessions || 0) + 1,
            dailyPomodoroSessions: (state.stats.dailyPomodoroSessions || 0) + 1,
            weeklyAverageEfficiency: ((state.stats.weeklyAverageEfficiency || 0) * 6 + efficiency) / 7,
            earlyBirdSessions: (state.stats.earlyBirdSessions || 0) + (isEarlyBird ? 1 : 0),
            nightOwlSessions: (state.stats.nightOwlSessions || 0) + (isNightOwl ? 1 : 0),
            deepWorkSessions: (state.stats.deepWorkSessions || 0) + (focusScore === 100 ? 1 : 0),
            longestTask: Math.max(state.stats.longestTask || 0, state.currentTask?.duration || 0),
          }

          return { stats: newStats }
        })

        get().checkAchievements()
      },

      toggleTimer: (active) => {
        set({ isTimerActive: active })
      },
    }),
    {
      name: "pomodoro-store",
    },
  ),
)

