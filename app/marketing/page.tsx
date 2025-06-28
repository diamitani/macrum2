
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Calendar, 
  FileText, 
  ArrowRight, 
  Star,
  Shield,
  Zap,
  Globe,
  BarChart3
} from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Macrum</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 The Future of Project Management
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Manage Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Multi-Business{" "}
            </span>
            Portfolio
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline projects across multiple businesses, freelance clients, and ventures with Macrum's unified dashboard. 
            The only project management tool built for portfolio entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <Link href="#demo">
                Watch Demo
              </Link>
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.9/5 from 500+ users</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-sm">Trusted by 50+ businesses</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for entrepreneurs managing multiple ventures, 
              Macrum provides all the tools you need in one unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Multi-Business Management</CardTitle>
                <CardDescription>
                  Organize projects across different businesses and ventures from a single dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <FolderKanban className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Project Tracking</CardTitle>
                <CardDescription>
                  Advanced project management with progress tracking, deadlines, and team collaboration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Keep track of all your clients, contacts, and communication in one place
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CheckSquare className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Break down projects into manageable tasks with deadlines and priority levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Calendar className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Smart Calendar</CardTitle>
                <CardDescription>
                  Integrated calendar view with project milestones and important dates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Get detailed insights into your business performance and project progress
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Macrum?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Built by entrepreneurs, for entrepreneurs who refuse to be limited by traditional project management tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-xl font-semibold mb-4">Secure & Reliable</h3>
              <p className="opacity-80">
                Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected and accessible.
              </p>
            </div>

            <div className="text-center">
              <Zap className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="opacity-80">
                Optimized for speed and performance. Manage hundreds of projects without any lag or delays.
              </p>
            </div>

            <div className="text-center">
              <Globe className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-xl font-semibold mb-4">Global Access</h3>
              <p className="opacity-80">
                Access your dashboard from anywhere in the world. Perfect for remote teams and global businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business Management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful entrepreneurs who trust Macrum to manage their multi-business portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/auth/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <Link href="/marketing/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-xl font-bold">Macrum</span>
              </div>
              <p className="text-gray-400 text-sm">
                The ultimate project management platform for multi-business portfolios.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/marketing/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketing/about" className="hover:text-white">About</Link></li>
                <li><Link href="/marketing/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/marketing/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketing/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/marketing/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/marketing/contact" className="hover:text-white">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Macrum. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
