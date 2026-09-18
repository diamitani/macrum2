"use client"

import { useMemo, useState } from "react"
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDeals } from "@/context/deal-context"
import { DealCard } from "@/components/deal-card"
import { DealCreateDialog } from "@/components/deal-create-dialog"
import { DEAL_STAGES, formatDealAmount, type DealStage } from "@/types/deal"

function StageColumn({
  stage,
  total,
  count,
  children,
}: {
  stage: { value: DealStage; label: string; weight: number }
  total: number
  count: number
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.value })

  return (
    <div className="flex min-h-[420px] w-72 shrink-0 flex-col rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between px-3 py-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{stage.label}</h3>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{formatDealAmount(total)}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 p-2 transition-colors",
          isOver && "rounded-b-lg bg-primary/10",
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default function DealsPage() {
  const { deals, isLoading, updateDeal } = useDeals()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Pointer sensor with a small activation distance so links stay clickable
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const handleMove = async (dealId: string, stage: DealStage) => {
    const deal = deals.find((d) => d.id === dealId)
    if (deal && deal.stage !== stage) {
      await updateDeal(dealId, { stage })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const stage = over.id as DealStage
    await handleMove(active.id as string, stage)
  }

  const stageTotals = useMemo(() => {
    const totals = {} as Record<DealStage, { count: number; value: number }>
    for (const s of DEAL_STAGES) totals[s.value] = { count: 0, value: 0 }
    for (const deal of deals) {
      totals[deal.stage].count += 1
      totals[deal.stage].value += deal.amount || 0
    }
    return totals
  }, [deals])

  const weightedForecast = useMemo(
    () =>
      DEAL_STAGES.reduce((sum, s) => sum + stageTotals[s.value].value * s.weight, 0),
    [stageTotals],
  )

  const openPipelineValue = useMemo(
    () =>
      DEAL_STAGES.filter((s) => s.value !== "lost").reduce((sum, s) => sum + stageTotals[s.value].value, 0),
    [stageTotals],
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading deals...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground">Drag deals between stages to update your pipeline</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      {/* Forecast strip */}
      <Card className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-8">
        <div>
          <p className="text-xs text-muted-foreground">Open pipeline</p>
          <p className="text-xl font-bold">{formatDealAmount(openPipelineValue)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Weighted forecast</p>
          <p className="text-xl font-bold text-primary">{formatDealAmount(weightedForecast)}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:ml-auto">
          {DEAL_STAGES.map((s) => (
            <span key={s.value}>
              {s.label} <span className="font-medium text-foreground">{Math.round(s.weight * 100)}%</span>
            </span>
          ))}
        </div>
      </Card>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <div className="text-center">
            <h3 className="mt-4 text-lg font-medium">No deals yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first deal to start your pipeline</p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Deal
            </Button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {DEAL_STAGES.map((stage) => (
              <StageColumn
                key={stage.value}
                stage={stage}
                total={stageTotals[stage.value].value}
                count={stageTotals[stage.value].count}
              >
                {deals
                  .filter((deal) => deal.stage === stage.value)
                  .map((deal) => (
                    <DealCard key={deal.id} deal={deal} onMove={handleMove} />
                  ))}
              </StageColumn>
            ))}
          </div>
        </DndContext>
      )}

      <DealCreateDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
