
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Macrum - Project Management for Multi-Business Portfolios",
  description: "The ultimate project management platform for entrepreneurs managing multiple businesses, freelance clients, and ventures.",
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
