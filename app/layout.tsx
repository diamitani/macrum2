import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { SetupWizardWrapper } from "@/components/setup-wizard/setup-wizard-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Macrum - Project Management for Multi-Business Portfolios",
  description:
    "Manage projects across multiple businesses, freelance clients, and ventures with Macrum's unified dashboard.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SetupWizardWrapper>{children}</SetupWizardWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
