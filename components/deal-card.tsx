"use client"

import Link from "next/link"
import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Building2, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBusinesses } from "@/context/business-context"
import { DEAL_STAGES, formatDealAmount, type Deal, type DealStage } from "@/types/deal"

interface DealCardProps {
  deal: Deal
  onMove: (dealId: string, stage: DealStage) => void
}

export function DealCard({ deal, onMove }: DealCardProps) {
  const { businesses } = useBusinesses()
  const company = businesses.find((b) => b.id === deal.companyId)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  })

  return (
    <Card
      ref={setNodeRef}
      className={cn("touch-none", isDragging && "opacity-50 shadow-lg ring-2 ring-primary")}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          {/* Drag handle — full title area is draggable, dropdown stays keyboard-reachable */}
          <div {...listeners} {...attributes} className="flex-1 min-w-0 cursor-grab active:cursor-grabbing">
            <Link
              href={`/deals/${deal.id}`}
              className="font-medium text-sm hover:underline line-clamp-2"
              onClick={(e) => {
                // Only follow the link on a real click, not while dragging
                if (isDragging) e.preventDefault()
              }}
            >
              {deal.name}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Move deal to stage">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" aria-label="Move deal to stage">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Move to</div>
              {DEAL_STAGES.filter((s) => s.value !== deal.stage).map((s) => (
                <DropdownMenuItem key={s.value} onClick={() => onMove(deal.id, s.value)}>
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-lg font-semibold">{formatDealAmount(deal.amount, deal.currency)}</div>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {company && (
            <span className="inline-flex items-center gap-1 truncate">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{company.name}</span>
            </span>
          )}
          {deal.closeDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 shrink-0" />
              Close: {new Date(deal.closeDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {deal.twentyId && <Badge variant="outline">Twenty synced</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
