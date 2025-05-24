"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Check, Clock, Calendar, Tag, MoreVertical, Edit, Trash2, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { getAIResponse } from "@/lib/ai-service"

interface Task {
  id: number
  title: string
  duration: number
  category?: string
  completed: boolean
  completedAt?: Date
  notes?: string
}

export function TaskManager() {
  const { tasks, addTask, completeTask, updateTask, deleteTask, setCurrentTask } = useStore()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDuration, setNewTaskDuration] = useState(25)
  const [newTaskCategory, setNewTaskCategory] = useState("")
  const [newTaskNotes, setNewTaskNotes] = useState("")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [aiResponse, setAiResponse] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  const categories = Array.from(new Set(tasks.map((task) => task.category).filter(Boolean)))
  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        duration: newTaskDuration,
        category: newTaskCategory,
        notes: newTaskNotes,
      })
      resetForm()
    }
  }

  const handleUpdateTask = () => {
    if (editingTask) {
      updateTask(editingTask.id, editingTask)
      setEditingTask(null)
    }
  }

  const resetForm = () => {
    setNewTaskTitle("")
    setNewTaskDuration(25)
    setNewTaskCategory("")
    setNewTaskNotes("")
    setIsAddingTask(false)
  }

  const handleAskAI = async (task: Task) => {
    setIsAiLoading(true)
    try {
      const response = await getAIResponse(
        `Please provide study tips and a brief outline for the task: "${task.title}". Consider that this task is planned for ${task.duration} minutes.`,
      )
      setAiResponse(response)
    } catch (error) {
      console.error("Error getting AI response:", error)
      setAiResponse("Sorry, I couldn't generate a response at this time. Please try again later.")
    }
    setIsAiLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:border-blue-500 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Task Manager</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsAddingTask(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium">{pendingTasks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{completedTasks.length}</span>
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Task Manager</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            </TabsList>
            <Button onClick={() => setIsAddingTask(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="pending" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => completeTask(task.id, 100)}
                      onEdit={() => setEditingTask(task)}
                      onDelete={() => deleteTask(task.id)}
                      onAskAI={() => handleAskAI(task)}
                      onStart={() => setCurrentTask(task)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="completed" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} completed onDelete={() => deleteTask(task.id)} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>

      {/* Add/Edit Task Dialog */}
      <Dialog
        open={isAddingTask || !!editingTask}
        onOpenChange={(open) => {
          if (!open) {
            resetForm()
            setEditingTask(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editingTask ? editingTask.title : newTaskTitle}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, title: e.target.value })
                    : setNewTaskTitle(e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duration"
                type="number"
                value={editingTask ? editingTask.duration : newTaskDuration}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, duration: Number.parseInt(e.target.value) })
                    : setNewTaskDuration(Number.parseInt(e.target.value))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={editingTask ? editingTask.category : newTaskCategory}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, category: e.target.value })
                    : setNewTaskCategory(e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editingTask ? editingTask.notes : newTaskNotes}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, notes: e.target.value })
                    : setNewTaskNotes(e.target.value)
                }
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setEditingTask(null)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Cancel
            </Button>
            <Button onClick={editingTask ? handleUpdateTask : handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingTask ? "Update" : "Add"} Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Response Dialog */}
      <Dialog
        open={!!aiResponse}
        onOpenChange={(open) => {
          if (!open) setAiResponse("")
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Study Assistant</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 border rounded p-4 max-h-[60vh]">
            {isAiLoading ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {aiResponse.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setAiResponse("")} className="bg-blue-600 hover:bg-blue-700 text-white">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

function TaskCard({
  task,
  completed = false,
  onComplete,
  onEdit,
  onDelete,
  onAskAI,
  onStart,
}: {
  task: Task
  completed?: boolean
  onComplete?: () => void
  onEdit?: () => void
  onDelete: () => void
  onAskAI?: () => void
  onStart?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("p-4 rounded-lg border", completed ? "bg-muted/50" : "bg-card")}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className={cn("font-medium", completed && "line-through text-muted-foreground")}>{task.title}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="text-xs text-blue-600 mt-1">
              Progress: {Math.round((task.elapsedTime || 0) / (task.duration * 60) * 100)}%
            </div>
            <Clock className="h-3 w-3" />
            <span>{task.duration}m</span>
            {task.category && (
              <>
                <Tag className="h-3 w-3" />
                <span>{task.category}</span>
              </>
            )}
            {completed && task.completedAt && (
              <>
                <Calendar className="h-3 w-3" />
                <span>Completed {task.completedAt.toLocaleDateString()}</span>
              </>
            )}
          </div>
          {task.notes && <p className="text-sm text-muted-foreground mt-2">{task.notes}</p>}
        </div>
        <div className="flex items-center gap-2">
          {!completed && onStart && (
            <Button variant="outline" size="sm" onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white">
              Start
            </Button>
          )}
          {!completed && onComplete && (
            <Button variant="ghost" size="sm" onClick={onComplete} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Check className="h-4 w-4" />
            </Button>
          )}
          {!completed && onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {!completed && onAskAI && (
            <Button variant="ghost" size="sm" onClick={onAskAI} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Brain className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!completed && onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  )
}

