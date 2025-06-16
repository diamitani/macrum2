
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
import { User, MoreHorizontal, Pencil, Trash, ExternalLink, Mail, Phone, MapPin } from "lucide-react"

interface ClientCardProps {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  businessName?: string
  onDelete?: (id: string) => void
}

export function ClientCard({
  id,
  name,
  email,
  phone,
  address,
  businessName,
  onDelete,
}: ClientCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            {businessName && (
              <Badge variant="secondary" className="text-xs">
                {businessName}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
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
                  <Link href={`/clients/${id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/clients/${id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit client
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
                  Delete client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {email && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            <span>{phone}</span>
          </div>
        )}
        {address && (
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-3">
        <Link href={`/clients/${id}`} className="text-sm text-muted-foreground hover:text-foreground w-full">
          View details
        </Link>
      </CardFooter>
    </Card>
  )
}
