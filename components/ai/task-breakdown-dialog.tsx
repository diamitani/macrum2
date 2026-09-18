"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useTasks } from "@/context/task-context"
import { AiNotConfigured } from "@/components/ai/not-configured"

interface BreakdownItem {
  title: string
  priority: "low" | "medium" | "high"
  dueOffsetDays: number
}

interface TaskBreakdownDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brief: string
  projectId: string
  projectContext?: string
}

export function TaskBreakdownDialog({
  open,
  onOpenChange,
  brief,
  projectId,
  projectContext,
}: TaskBreakdownDialogProps) {
  const { addTask } = useTasks()
  const [items, setItems] = useState<BreakdownItem[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const generate = async () => {
    setIsLoading(true)
    setError(null)
    setNotConfigured(false)
    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, projectContext }),
      })
      if (res.status === 503) {
        setNotConfigured(true)
        return
      }
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate tasks.")
      }
      const tasks: BreakdownItem[] = data.tasks || []
      setItems(tasks)
      setSelected(new Set(tasks.map((_, i) => i)))
      setHasGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleApprove = async () => {
    setIsCreating(true)
    try {
      const chosen = items.filter((_, i) => selected.has(i))
      let created = 0
      for (const item of chosen) {
        const dueDate =
          item.dueOffsetDays > 0
            ? new Date(Date.now() + item.dueOffsetDays * 86_400_000).toISOString()
            : undefined
        const result = await addTask({
          title: item.title,
          priority: item.priority,
          status: "todo",
          projectId,
          dueDate,
        })
        if (result) created += 1
      }
      toast({
        title: "Tasks created",
        description: `${created} task${created === 1 ? "" : "s"} added to the project.`,
      })
      onOpenChange(false)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setItems([])
          setSelected(new Set())
          setError(null)
          setNotConfigured(false)
          setHasGenerated(false)
        }
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Break down into tasks
          </DialogTitle>
          <DialogDescription>
            Review the suggested tasks. Only the ones you check will be created — nothing is added
            until you approve.
          </DialogDescription>
        </DialogHeader>

        {notConfigured ? (
          <AiNotConfigured />
        ) : !hasGenerated && !isLoading ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Create a smart task list from your brief for this project.
            </p>
            <Button onClick={generate} className="mt-4" disabled={!brief.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate tasks
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Thinking of tasks...</span>
          </div>
        ) : (
          <div className="max-h-[320px] space-y-2 overflow-y-auto py-2">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks suggested.</p>
            )}
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                <Checkbox
                  id={`breakdown-${i}`}
                  checked={selected.has(i)}
                  onCheckedChange={() => toggle(i)}
                  className="mt-0.5"
                />
                <label htmlFor={`breakdown-${i}`} className="flex-1 cursor-pointer space-y-1">
                  <p className="text-sm font-medium leading-snug">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.priority === "high"
                          ? "destructive"
                          : item.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                    {item.dueOffsetDays > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Due in {item.dueOffsetDays} day{item.dueOffsetDays === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {hasGenerated && !notConfigured && (
            <Button onClick={handleApprove} disabled={isCreating || selected.size === 0}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create ${selected.size} task${selected.size === 1 ? "" : "s"}`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
