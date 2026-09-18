export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"

export interface DealActivity {
  id: string
  text: string
  createdAt: string
}

export interface Deal {
  id: string
  name: string
  amount: number
  currency: string
  stage: DealStage
  companyId?: string
  contactId?: string
  closeDate?: string
  notes?: string
  twentyId?: string
  activities: DealActivity[]
  createdAt: string
  updatedAt: string
}

export const DEAL_STAGES: { value: DealStage; label: string; weight: number }[] = [
  { value: "lead", label: "Lead", weight: 0.1 },
  { value: "qualified", label: "Qualified", weight: 0.25 },
  { value: "proposal", label: "Proposal", weight: 0.5 },
  { value: "negotiation", label: "Negotiation", weight: 0.75 },
  { value: "won", label: "Won", weight: 1 },
  { value: "lost", label: "Lost", weight: 0 },
]

export function formatDealAmount(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}
