
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { PlusCircle, Search, BookOpen, Edit, Trash2, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentPage, setCurrentPage] = useState(0)
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
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const currentNote = filteredNotes[currentPage]
  const totalPages = filteredNotes.length

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-amber-700" />
          <h1 className="text-3xl font-bold text-amber-900 font-serif">My Notepad</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-10 w-64 bg-white/80 border-amber-200 focus:border-amber-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new note to your notepad
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

      {/* Notepad */}
      <div className="flex-1 flex items-center justify-center">
        {totalPages > 0 ? (
          <div className="relative">
            {/* Notepad Background */}
            <Card className="w-[800px] h-[600px] bg-gradient-to-b from-white to-gray-50 shadow-2xl border-l-4 border-l-red-400 relative overflow-hidden">
              {/* Spiral binding holes */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-red-300"></div>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-6 w-3 h-3 bg-gray-200 rounded-full border border-gray-300"
                  style={{ top: `${30 + i * 28}px` }}
                ></div>
              ))}

              {/* Horizontal lines */}
              <div className="absolute inset-0 pt-20 pl-16 pr-8">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-px bg-blue-200 opacity-40"
                    style={{ marginBottom: '27px' }}
                  ></div>
                ))}
              </div>

              <CardContent className="relative h-full p-0">
                {/* Note content */}
                <div className="absolute inset-0 pt-16 pl-20 pr-12 pb-16 overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 font-handwriting leading-tight max-w-md">
                      {currentNote.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(currentNote)}
                        className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(currentNote.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-6 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(currentNote.updatedAt)}
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 font-handwriting leading-relaxed whitespace-pre-wrap text-lg">
                      {currentNote.content || "This page is empty..."}
                    </p>
                  </div>

                  {currentNote.tags.length > 0 && (
                    <div className="absolute bottom-8 left-0 right-0">
                      <div className="flex flex-wrap gap-2">
                        {currentNote.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Page number */}
                <div className="absolute bottom-4 right-8 text-sm text-gray-500 font-medium">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 border-amber-300 hover:bg-amber-50"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 border-amber-300 hover:bg-amber-50"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-[800px] h-[600px] bg-gradient-to-b from-white to-gray-50 shadow-2xl border-l-4 border-l-red-400 relative overflow-hidden flex items-center justify-center">
              {/* Spiral binding holes */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-red-300"></div>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-6 w-3 h-3 bg-gray-200 rounded-full border border-gray-300"
                  style={{ top: `${30 + i * 28}px` }}
                ></div>
              ))}

              {/* Horizontal lines */}
              <div className="absolute inset-0 pt-20 pl-16 pr-8">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-px bg-blue-200 opacity-40"
                    style={{ marginBottom: '27px' }}
                  ></div>
                ))}
              </div>

              <div className="text-center z-10">
                <BookOpen className="mx-auto h-16 w-16 text-amber-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2 font-handwriting">
                  {searchQuery ? "No notes match your search" : "Your notepad is empty"}
                </h3>
                <p className="text-gray-600 mb-6 font-handwriting text-lg">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start writing your first note"}
                </p>
                {!searchQuery && (
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Write Your First Note
                  </Button>
                )}
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="border-amber-300 hover:bg-amber-50"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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
