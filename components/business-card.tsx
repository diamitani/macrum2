"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Briefcase, MoreHorizontal, Pencil, Trash, ExternalLink } from "lucide-react"

interface BusinessCardProps {
  id: string
  name: string
  description: string
  projectCount: number
  activeProjects: number
  industry?: string
  onDelete?: (id: string) => void
}

export function BusinessCard({
  id,
  name,
  description,
  projectCount,
  activeProjects,
  industry,
  onDelete,
}: BusinessCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            {industry && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                {industry}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/businesses/${id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/businesses/${id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit business
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete?.(id)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete business
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div>Total Projects: {projectCount}</div>
          <Badge variant="secondary">{activeProjects} Active</Badge>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-3">
        <Link href={`/businesses/${id}`} className="text-sm text-muted-foreground hover:text-foreground w-full">
          View details
        </Link>
      </CardFooter>
    </Card>
  )
}
