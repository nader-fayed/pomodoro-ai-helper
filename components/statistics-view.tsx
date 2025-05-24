"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function StatisticsView() {
  const stats = useStore((state) => state.stats)
  const tasks = useStore((state) => state.tasks)
  const [activeTab, setActiveTab] = useState("overview")

  const weeklyData = stats.weeklyStudyTime.map((time, index) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index],
    hours: time / 60,
  }))

  const efficiencyData = tasks
    .filter((task) => task.completed && task.efficiency)
    .map((task) => ({
      name: task.title,
      efficiency: task.efficiency,
    }))

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Analysis</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-blue-50"
            >
              <h3 className="font-medium mb-2">Focus Score</h3>
              <div className="text-2xl font-bold text-blue-600">{stats.focusScore}%</div>
              <p className="text-sm text-blue-600">Best: {stats.bestFocusScore}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-green-50"
            >
              <h3 className="font-medium mb-2">Efficiency</h3>
              <div className="text-2xl font-bold text-green-600">{stats.averageEfficiency}%</div>
              <p className="text-sm text-green-600">Tasks Completed: {stats.tasksCompleted}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-purple-50"
            >
              <h3 className="font-medium mb-2">Study Time</h3>
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalStudyTime / 60)}h</div>
              <p className="text-sm text-purple-600">Breaks Taken: {stats.totalBreaks}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-orange-50"
            >
              <h3 className="font-medium mb-2">Streak</h3>
              <div className="text-2xl font-bold text-orange-600">{stats.studyStreak} days</div>
              <p className="text-sm text-orange-600">
                Level {stats.level} • {stats.xp} XP
              </p>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="efficiency">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

