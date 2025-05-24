export interface Task {
  id: number
  title: string
  duration: number
  completed: boolean
  category?: string
  createdAt: Date
  actualDuration?: number
  efficiency?: number
  breaks?: number
  focusScore?: number
}

export interface StudySession {
  id: number
  taskId: number
  startTime: Date
  endTime?: Date
  duration: number
  actualDuration: number
  efficiency: number
  breaks: number
  focusScore: number
}

export interface UserStats {
  level: number
  xp: number
  focusScore: number
  studyStreak: number
  totalStudyTime: number
  tasksCompleted: number
  averageEfficiency: number
  totalBreaks: number
  bestFocusScore: number
  weeklyStudyTime: number[]
}

export interface StudyPlan {
  id: number
  title: string
  tasks: Task[]
  createdAt: Date
  aiGenerated: boolean
  targetStudyTime: number
  recommendedBreaks: number
}

