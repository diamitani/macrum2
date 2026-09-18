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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Loader2, Copy, Check, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { AiNotConfigured } from "@/components/ai/not-configured"

interface FollowupDialogProps {
  recordType: "contact" | "deal"
  name: string
  context?: string
  trigger?: React.ReactNode
}

/**
 * "Draft follow-up" modal. Generates a subject + email body and offers
 * copy-to-clipboard. Built for contact/deal detail pages when they exist.
 */
export function FollowupDialog({ recordType, name, context = "", trigger }: FollowupDialogProps) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [copied, setCopied] = useState(false)

  const reset = () => {
    setSubject("")
    setBody("")
    setError(null)
    setNotConfigured(false)
    setCopied(false)
  }

  const generate = async () => {
    setIsLoading(true)
    setError(null)
    setNotConfigured(false)
    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordType, name, context }),
      })
      if (res.status === 503) {
        setNotConfigured(true)
        return
      }
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to draft the follow-up.")
      }
      setSubject(data.subject || "")
      setBody(data.body || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
      setCopied(true)
      toast({ title: "Copied", description: "Follow-up draft copied to clipboard." })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access. Select the text manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) reset()
        setOpen(v)
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Draft follow-up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Follow-up for {name}
          </DialogTitle>
          <DialogDescription>
            Review the draft before you send it. Nothing is sent automatically.
          </DialogDescription>
        </DialogHeader>

        {notConfigured ? (
          <AiNotConfigured />
        ) : !subject && !body && !isLoading ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Create a friendly follow-up email for this {recordType}.
            </p>
            <Button onClick={generate} className="mt-4">
              <Mail className="mr-2 h-4 w-4" />
              Draft email
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Writing a draft...</span>
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="followup-subject">Subject</Label>
              <Input
                id="followup-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="followup-body">Body</Label>
              <Textarea
                id="followup-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[220px]"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          {subject && body && !notConfigured && (
            <Button onClick={handleCopy}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Copy to clipboard"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
