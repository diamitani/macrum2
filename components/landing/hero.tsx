"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Building2, Users, FolderOpen, Briefcase, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 sm:pt-24 sm:pb-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <span className="mr-2">🚀</span>
            For Freelancers, Agencies & Multi-Business Owners
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Manage Projects Across
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Your Entire Portfolio
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Whether you're a freelancer juggling multiple clients, running a sales agency, or managing an AI consultancy
            - Macrum gives you a unified command center to track every project, contract, and opportunity across your
            entire business portfolio.
          </p>

          {/* Use Cases */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Freelancers</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Agencies</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Consultancies</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
              <FolderOpen className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Multi-Business</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Track all client projects in one place</span>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Manage contracts & deadlines</span>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Unified dashboard for everything</span>
            </div>
          </div>
        </div>

        {/* Freelancer Use Case Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect for Freelancers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage multiple clients, track project progress, and never miss a deadline again
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Project Management</h3>
              <p className="text-gray-600 mb-4">
                Organize projects by client, track deliverables, and maintain clear communication timelines.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Separate workspaces per client
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Project milestone tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Deadline management
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contract & Invoice Tracking</h3>
              <p className="text-gray-600 mb-4">
                Keep track of contracts, payment schedules, and invoice statuses across all your clients.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Contract status monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Payment tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Revenue analytics
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Time & Productivity</h3>
              <p className="text-gray-600 mb-4">
                Monitor time spent on projects, track productivity, and optimize your workflow.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Time tracking per project
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Productivity insights
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Workload balancing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-sm text-gray-600">macrum.app/dashboard</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Client A - Web Design</h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2 text-sm">Homepage Redesign</div>
                    <div className="bg-white rounded p-2 text-sm">Mobile Optimization</div>
                    <div className="bg-white rounded p-2 text-sm">Final Review</div>
                  </div>
                  <div className="mt-3 text-xs text-blue-700">Due: Dec 15, 2024</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Client B - App Development</h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2 text-sm">API Integration</div>
                    <div className="bg-white rounded p-2 text-sm">User Testing</div>
                    <div className="bg-white rounded p-2 text-sm">Bug Fixes</div>
                  </div>
                  <div className="mt-3 text-xs text-purple-700">Due: Jan 10, 2025</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Client C - Marketing</h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2 text-sm">Campaign Strategy</div>
                    <div className="bg-white rounded p-2 text-sm">Content Creation</div>
                    <div className="bg-white rounded p-2 text-sm">Performance Analysis</div>
                  </div>
                  <div className="mt-3 text-xs text-green-700">Due: Dec 30, 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
