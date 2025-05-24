"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Save, Trash } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  timestamp: number
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Notes({ open = false, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem("study_notes")
      return savedNotes ? JSON.parse(savedNotes) : []
    }
    return []
  })
  const [newNote, setNewNote] = useState({ title: "", content: "" })

  useEffect(() => {
    localStorage.setItem("study_notes", JSON.stringify(notes))
  }, [notes])

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        timestamp: Date.now(),
      }
      setNotes((prev) => [note, ...prev])
      setNewNote({ title: "", content: "" })
    }
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[800px]">
        <DialogHeader>
          <DialogTitle>Study Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-4 flex-1 mr-4">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
              />
              <Input
                placeholder="Note content"
                value={newNote.content}
                onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
              />
            </div>
            <Button onClick={() => handleAddNote()} disabled={!newNote.title || !newNote.content}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-3 rounded-lg border bg-white/80">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{note.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{note.content}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(note.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
  
}