"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, X, Send, MessageSquare, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { MusicPlayer } from "@/components/music-player"
import { cn } from "@/lib/utils"
import {
  getAIResponse,
  analyzePerformance,
  suggestBreakActivity,
  generateStudyPlan,
  explainConcept, // Import explainConcept
} from "@/lib/ai-service"

interface Task {
  id: number
  title: string
  duration: number
  completed: boolean
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function PomodoroApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDuration, setNewTaskDuration] = useState(25)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "I'm here to help you study effectively. What would you like to know?" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSubject, setCurrentSubject] = useState("")
  const [currentTopic, setCurrentTopic] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const parts = newTaskTitle.split(":").map((p) => p.trim())
      if (parts.length >= 2) {
        setCurrentSubject(parts[0])
        setCurrentTopic(parts[1])
      }

      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        duration: newTaskDuration,
        completed: false,
      }
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      setNewTaskTitle("")
      setNewTaskDuration(25)
      setIsAddingTask(false)
    }
  }

  const handleTaskComplete = async () => {
    if (currentTask) {
      setTasks(tasks.map((task) => (task.id === currentTask.id ? { ...task, completed: true } : task)))
      setCurrentTask(null)

      // Update this part to use analyzePerformance
      const completedTask = tasks.find((t) => t.id === currentTask.id)
      if (completedTask) {
        const response = await analyzePerformance(completedTask, { averageEfficiency: 0, focusScore: 0 }) // You might want to pass actual user stats here
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
      }

      const breakResponse = await suggestBreakActivity(5, 0) // You might want to pass an actual focus score here
      setMessages((prev) => [...prev, { role: "assistant", content: breakResponse }])
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setIsLoading(true)
      const userMessage = { role: "user" as const, content: newMessage }
      setMessages((prev) => [...prev, userMessage])
      setNewMessage("")

      try {
        let response
        if (newMessage.toLowerCase().includes("explain") || newMessage.toLowerCase().includes("what is")) {
          response = await explainConcept(currentSubject || "general", newMessage)
        } else {
          response = await getAIResponse(newMessage)
        }

        if (response) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: response,
            },
          ])
        }
      } catch (error) {
        console.error("Chat Error:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble responding right now. Please try again.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleStartStudySession = async () => {
    if (currentTask && currentSubject && currentTopic) {
      const response = await generateStudyPlan(currentSubject, currentTask.duration, {
        averageEfficiency: 0,
        focusScore: 0,
        studyStreak: 0,
      }) // You might want to pass actual user stats here
      setMessages((prev) => [...prev, { role: "assistant", content: JSON.stringify(response) }])
    }
  }

  // Remove or comment out these functions as they are not defined in the ai-service
  // const handleAskForHelp = async () => {
  //   if (currentSubject && currentTopic) {
  //     const response = await generatePracticeQuestion(currentSubject, currentTopic)
  //     setMessages((prev) => [...prev, { role: "assistant", content: response }])
  //   }
  // }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <h3 className="font-semibold">Pomodoro Timer</h3>
                  <p className="text-sm text-gray-500">{currentTask ? currentTask.title : "Select a task to start"}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={cn(isFocusMode && "bg-purple-100")}
              >
                {isFocusMode ? "Exit Focus" : "Focus Mode"}
              </Button>
            </div>
            <PomodoroTimer currentTask={currentTask} onTimerComplete={handleTaskComplete} />
          </Card>

          <Card className={cn("p-6", isFocusMode && "opacity-100")}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Tasks</h3>
              </div>
              <Button onClick={() => setIsAddingTask(true)} size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 mb-2 rounded-lg border",
                    task.completed && "bg-gray-50",
                    currentTask?.id === task.id && "border-purple-500",
                  )}
                  onClick={() => {
                    if (!task.completed && !currentTask) {
                      setCurrentTask(task)
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={cn("font-medium", task.completed && "line-through")}>{task.title}</p>
                      <p className="text-sm text-gray-500">Duration: {task.duration} minutes</p>
                    </div>
                    {currentTask?.id === task.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentTask(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* Right Column */}
        <div className={cn("space-y-4 transition-all duration-300", isFocusMode && "opacity-30 pointer-events-none blur-sm")}>
          <MusicPlayer />

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Study Assistant</h3>
            </div>

            <ScrollArea className="h-[400px] mb-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("mb-4", message.role === "assistant" ? "mr-12" : "ml-12")}>
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      message.role === "assistant" ? "bg-gray-100" : "bg-purple-500 text-white",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4 mr-12">
                  <div className="p-3 rounded-lg bg-gray-100">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Ask for help..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={newTaskDuration}
              onChange={(e) => setNewTaskDuration(Number(e.target.value))}
              min={1}
              max={60}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

