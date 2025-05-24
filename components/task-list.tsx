"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/lib/store"

export function TaskList() {
  const { tasks, currentTask, addTask, setCurrentTask } = useStore()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDuration, setNewTaskDuration] = useState(25)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        duration: newTaskDuration,
      })
      setNewTaskTitle("")
      setNewTaskDuration(25)
      setIsAddingTask(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Study Tasks</h3>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="sm" onClick={() => setIsAddingTask(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </motion.div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border mb-2 transition-colors ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : currentTask?.id === task.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white hover:border-blue-200 cursor-pointer"
              }`}
              onClick={() => !task.completed && setCurrentTask(task)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-full ${
                      task.completed ? "bg-green-100" : currentTask?.id === task.id ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    {task.completed ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-600" />
                    )}
                  </motion.div>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.duration} minutes</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Time Efficiency: {task.efficiency ? `${Math.round(task.efficiency)}%` : '0%'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Study Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Input placeholder="Task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                min={5}
                max={60}
                step={5}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingTask(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Cancel
              </Button>
              <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white">Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

