
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Search, BookOpen, Edit, Trash2, Calendar } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function NotebookPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  })

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("macrum_notes")
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("macrum_notes", JSON.stringify(notes))
  }, [notes])

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const handleCreateNote = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note",
        variant: "destructive",
      })
      return
    }

    const newNote: Note = {
      id: generateId(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => [newNote, ...prev])
    setFormData({ title: "", content: "", tags: "" })
    setIsCreateDialogOpen(false)
    
    toast({
      title: "Note created",
      description: "Your note has been saved successfully",
    })
  }

  const handleEditNote = () => {
    if (!editingNote || !formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note",
        variant: "destructive",
      })
      return
    }

    const updatedNote: Note = {
      ...editingNote,
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    }

    setNotes(prev => prev.map(note => note.id === editingNote.id ? updatedNote : note))
    setFormData({ title: "", content: "", tags: "" })
    setIsEditDialogOpen(false)
    setEditingNote(null)
    
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully",
    })
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully",
    })
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    })
    setIsEditDialogOpen(true)
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notebook</h1>
          <p className="text-muted-foreground">Capture your thoughts and ideas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new note to your notebook
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your note here..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNote}>Create Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(note.updatedAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(note)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {note.content || "No content"}
                  </p>
                </div>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 border rounded-lg">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">
              {searchQuery ? "No notes match your search" : "No notes yet"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms or clear the search"
                : "Create your first note to start capturing your thoughts"}
            </p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Note
              </Button>
            )}
            {searchQuery && (
              <Button className="mt-4" variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your note here..."
                className="min-h-[200px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
