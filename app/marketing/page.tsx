"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Building2,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Globe,
  Menu,
  X,
  ChevronRight,
  Layers,
  Target,
  Clock,
  TrendingUp,
  Check,
  ChevronDown,
  Sparkles,
  Lock,
} from "lucide-react"

// ─────────────────────────────────────────
// Animated counter hook (CSS only, no framer)
// ─────────────────────────────────────────
function useCountUp(end: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

// ─────────────────────────────────────────
// Intersection observer helper
// ─────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─────────────────────────────────────────
// Stat counter component
// ─────────────────────────────────────────
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView(0.3)
  const count = useCountUp(value, 1800, inView)
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        {count.toLocaleString()}<span className="text-indigo-400">{suffix}</span>
      </div>
      <div className="mt-2 text-sm text-zinc-400 uppercase tracking-widest">{label}</div>
    </div>
  )
}

const FEATURES = [
  {
    icon: Building2,
    title: "Multi-Business Hub",
    body: "One workspace for every venture — freelance, startup, side project. Context-switch in one click.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    size: "md:col-span-2",
  },
  {
    icon: FolderKanban,
    title: "Project Tracking",
    body: "Kanban, list, or timeline views. Deadlines, progress bars, and team collaboration built in.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    size: "",
  },
  {
    icon: Users,
    title: "Client CRM",
    body: "Track all clients, contacts, and communications from a single, unified view.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    size: "",
  },
  {
    icon: CheckSquare,
    title: "Smart Tasks",
    body: "Priority levels, labels, assignees, and dependencies. Tasks that actually map to real work.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    size: "",
  },
  {
    icon: Calendar,
    title: "Unified Calendar",
    body: "Milestones, deadlines, and events from every business — one calendar to rule them all.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    size: "",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    body: "Portfolio-level insights: revenue trends, project health scores, and team velocity.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    size: "md:col-span-2",
  },
]

const TESTIMONIALS = [
  {
    quote: "Macrum replaced four different tools for me. Now I can see all three of my businesses in one place.",
    name: "Jordan Rivera",
    role: "Founder, 3 companies",
    initials: "JR",
    accent: "bg-indigo-500",
  },
  {
    quote: "The multi-business dashboard is unlike anything else. My team loves the clean interface.",
    name: "Priya Mehta",
    role: "CEO, Studio PM",
    initials: "PM",
    accent: "bg-violet-500",
  },
  {
    quote: "Finally — a project tool that actually gets the portfolio entrepreneur lifestyle.",
    name: "Alex Chen",
    role: "Serial Founder",
    initials: "AC",
    accent: "bg-sky-500",
  },
]

const PLANS = [
  {
    name: "Solo",
    price: "0",
    period: "free forever",
    description: "For solo operators just getting started.",
    features: ["1 business workspace", "Up to 10 projects", "100 tasks", "Basic analytics"],
    cta: "Start Free",
    href: "/auth/signup",
    featured: false,
  },
  {
    name: "Builder",
    price: "29",
    period: "per month",
    description: "For entrepreneurs managing multiple ventures.",
    features: ["Unlimited businesses", "Unlimited projects", "Unlimited tasks", "Advanced analytics", "Team members (5)", "Priority support"],
    cta: "Start Trial",
    href: "/auth/signup",
    featured: true,
  },
  {
    name: "Portfolio",
    price: "79",
    period: "per month",
    description: "For power users and growing teams.",
    features: ["Everything in Builder", "Unlimited team members", "Custom domains", "API access", "Dedicated success manager", "SSO / SAML"],
    cta: "Contact Sales",
    href: "/marketing/contact",
    featured: false,
  },
]

const FAQS = [
  {
    question: "Can I manage separate businesses with separate teams?",
    answer: "Yes. Macrum allows you to create completely segregated business workspaces with distinct team access permissions, client directories, and project pipelines while giving you a consolidated executive view.",
  },
  {
    question: "How does the free tier work?",
    answer: "The Solo plan is free forever with no credit card required. You get 1 business workspace, up to 10 projects, and 100 active tasks. Upgrade anytime when you scale.",
  },
  {
    question: "Can I import data from other project management tools?",
    answer: "Yes, Macrum supports easy JSON backup export and import, as well as direct CSV imports for clients, tasks, and project records.",
  },
  {
    question: "Is my client and financial data secure?",
    answer: "All data is encrypted in transit (TLS 1.3) and at rest with strict workspace segregation. We never share or sell your company information.",
  },
]

export default function MarketingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { ref: featuresRef, inView: featuresVisible } = useInView(0.1)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      {/* ── Global animation keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Outfit', system-ui, sans-serif; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
          50%       { box-shadow: 0 0 40px 8px rgba(99,102,241,0.25); }
        }
        .animate-fade-up         { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fade-up-delay-1 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .animate-fade-up-delay-2 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .animate-fade-up-delay-3 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
        .animate-fade-in         { animation: fade-in 1.1s ease both; }
        .animate-float           { animation: float 6s ease-in-out infinite; }
        .animate-glow            { animation: glow-pulse 3s ease-in-out infinite; }
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.08s; }
        .reveal-delay-2 { transition-delay: 0.16s; }
        .reveal-delay-3 { transition-delay: 0.24s; }
        .reveal-delay-4 { transition-delay: 0.32s; }
        .reveal-delay-5 { transition-delay: 0.40s; }
        .reveal-delay-6 { transition-delay: 0.48s; }
        .hero-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          color: white;
          padding: 0.75rem 1.75rem;
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: -0.01em;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.4), 0 4px 12px rgba(99,102,241,0.25);
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.6), 0 8px 24px rgba(99,102,241,0.35);
        }
        .btn-primary:active { transform: translateY(0px) scale(0.98); }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: rgba(255,255,255,0.7);
          padding: 0.75rem 1.75rem;
          border-radius: 0.625rem;
          font-weight: 500;
          font-size: 0.9375rem;
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-ghost:hover {
          color: white;
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.05);
          transform: translateY(-1px);
        }
        .btn-ghost:active { transform: scale(0.98); }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 1rem;
          padding: 1.75rem;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, transparent 40%, rgba(99,102,241,0.04) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.05);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.15);
        }
        .feature-card:hover::before { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-fade-up-delay-1, .animate-fade-up-delay-2, .animate-fade-up-delay-3,
          .animate-float, .animate-glow { animation: none !important; opacity: 1 !important; transform: none !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
          .feature-card:hover, .btn-primary:hover, .btn-ghost:hover { transform: none !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/marketing" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold tracking-tight">Macrum</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { name: "Features", href: "#features" },
              { name: "Pricing", href: "#pricing" },
              { name: "Testimonials", href: "#testimonials" },
              { name: "FAQ", href: "#faq" },
              { name: "Contact", href: "/marketing/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-150"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-zinc-950/98 border-t border-white/[0.06] px-5 py-4 space-y-2">
            {[
              { name: "Features", href: "#features" },
              { name: "Pricing", href: "#pricing" },
              { name: "Testimonials", href: "#testimonials" },
              { name: "FAQ", href: "#faq" },
              { name: "Contact", href: "/marketing/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm text-zinc-300 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              <Link href="/auth/signin" className="btn-ghost text-sm justify-center">Sign In</Link>
              <Link href="/auth/signup" className="btn-primary text-sm justify-center">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[92dvh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background glows */}
        <div className="hero-glow -top-40 -left-40 opacity-60" />
        <div className="hero-glow -bottom-20 right-0 opacity-40" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            {/* Eyebrow badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Built for portfolio entrepreneurs
            </div>

            <h1 className="animate-fade-up text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.04] mb-6">
              All your
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                businesses.
              </span>
              <br />
              One command center.
            </h1>

            <p className="animate-fade-up-delay-1 text-lg text-zinc-400 leading-relaxed mb-8 max-w-[48ch]">
              Macrum unifies your projects, clients, tasks, and calendar across every venture — so you stop juggling tabs and start building.
            </p>

            <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup" className="btn-primary">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="btn-ghost">
                See Features <ChevronRight className="w-4 h-4 opacity-60" />
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="animate-fade-up-delay-3 mt-10 flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {[
                  { bg: "bg-indigo-500", text: "J" },
                  { bg: "bg-violet-500", text: "P" },
                  { bg: "bg-sky-500", text: "A" },
                  { bg: "bg-emerald-500", text: "M" },
                ].map((avatar, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-zinc-950 ${avatar.bg} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {avatar.text}
                  </div>
                ))}
              </div>
              <div className="text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span>Trusted by <strong className="text-zinc-300 font-semibold">500+</strong> entrepreneurs</span>
              </div>
            </div>
          </div>

          {/* Right: product screenshot */}
          <div className="animate-fade-in relative">
            <div className="animate-float relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.15)] animate-glow">
              {/* Browser chrome */}
              <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 px-3 py-1 bg-zinc-800/60 rounded-md text-[11px] text-zinc-500 text-center">
                  app.macrum.io/dashboard
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-dashboard.jpg"
                alt="Macrum dashboard showing multi-business project management"
                className="w-full block"
                style={{ maxHeight: "440px", objectFit: "cover", objectPosition: "top" }}
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 shadow-xl flex items-center gap-3 backdrop-blur-xl">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-medium">Portfolio Growth</div>
                <div className="text-sm font-bold text-white">+34% this quarter</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Counters Strip ── */}
      <section className="py-16 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value={500} suffix="+" label="Active Founders" />
          <StatCounter value={1200} suffix="+" label="Businesses Managed" />
          <StatCounter value={28000} suffix="+" label="Tasks Completed" />
          <StatCounter value={99} suffix=".9%" label="Uptime Guarantee" />
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-24 px-5 lg:px-8 max-w-7xl mx-auto">
        <div className={`text-center mb-16 reveal ${featuresVisible ? "visible" : ""}`} ref={featuresRef}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Engineered for Velocity
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything your portfolio needs
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed">
            Eliminate operational friction across companies. Macrum gives you the power of enterprise ERP with the lightness of modern software.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className={`feature-card ${feat.size} reveal ${featuresVisible ? "visible" : ""} reveal-delay-${i + 1}`}
              >
                <div className={`w-11 h-11 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${feat.color}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feat.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Interactive Live Preview Widget ── */}
      <section className="py-20 px-5 lg:px-8 bg-zinc-900/30 border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              One view for every business milestone
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Switch context effortlessly between your ventures without losing momentum.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-zinc-200">Portfolio Status: 3 Active Ventures</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Live Synced
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-6">
              {[
                { name: "Apex Mobile App", company: "Tech Venture", progress: 85, color: "bg-indigo-500", badge: "On Track" },
                { name: "Helios Brand Identity", company: "Design Agency", progress: 60, color: "bg-violet-500", badge: "In Review" },
                { name: "Luna CRM Launch", company: "SaaS Product", progress: 92, color: "bg-emerald-500", badge: "Ready" },
              ].map((item) => (
                <div key={item.name} className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">{item.company}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-zinc-300">{item.badge}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-3">{item.name}</h4>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Pillars ── */}
      <section className="py-24 px-5 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Enterprise-Grade Security",
              desc: "Encrypted workspaces with granular role-based permissions to keep client data strictly separated.",
              color: "text-indigo-400",
              bg: "bg-indigo-500/10",
            },
            {
              icon: Zap,
              title: "Ultra-Fast Performance",
              desc: "Instant page transitions, offline-first notes, and sub-100ms response times for friction-free work.",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              icon: Globe,
              title: "Data Portability",
              desc: "Full automated backups and export to JSON anytime. Your data is yours forever.",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="text-center p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06]">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-5`}>
                <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-5 lg:px-8 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Loved by serial entrepreneurs</h2>
            <p className="text-zinc-400 text-base max-w-xl mx-auto">
              Here is what founders say about switching their entire portfolio to Macrum.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ quote, name, role, initials, accent }) => (
              <div key={name} className="p-8 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex flex-col justify-between">
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${accent} flex items-center justify-center text-xs font-bold text-white`}>
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-zinc-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-5 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple plans that scale with you
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Start free, upgrade when your businesses grow. No surprise fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map(({ name, price, period, description, features, cta, href, featured }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                featured
                  ? "bg-gradient-to-b from-indigo-950/40 via-zinc-900 to-zinc-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 md:-translate-y-2"
                  : "bg-zinc-900/40 border-white/[0.08] hover:border-white/20"
              }`}
            >
              {featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-[11px] font-semibold tracking-wide uppercase text-white shadow-lg">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                <p className="text-xs text-zinc-400 mb-6">{description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-zinc-500">/{period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <Check className={`w-4 h-4 flex-shrink-0 ${featured ? "text-indigo-400" : "text-zinc-500"}`} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={href}
                className={`w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  featured ? "btn-primary justify-center" : "btn-ghost justify-center"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-5 lg:px-8 border-t border-white/[0.06] bg-zinc-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400 text-base">Everything you need to know about getting started.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/[0.08] bg-zinc-900/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-white hover:text-indigo-300 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-400" : "text-zinc-500"}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden border border-indigo-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-zinc-950 to-violet-950/60" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative text-center py-20 px-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Ready to take control of<br />your entire portfolio?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              Join hundreds of entrepreneurs who run leaner, move faster, and stress less with Macrum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-3.5">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/marketing/contact" className="btn-ghost text-base px-8 py-3.5">
                Talk to Sales
              </Link>
            </div>
            <p className="mt-6 text-xs text-zinc-600">No credit card required · Free forever plan · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] bg-zinc-950 py-16 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            {/* Brand col */}
            <div className="md:col-span-1">
              <Link href="/marketing" className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-lg font-bold tracking-tight">Macrum</span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The command center for portfolio entrepreneurs managing multiple businesses.
              </p>
            </div>

            {/* Product col */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Pricing</Link></li>
                <li><Link href="#testimonials" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Testimonials</Link></li>
                <li><Link href="#faq" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Company col */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/marketing/contact" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Contact Sales</Link></li>
                <li><Link href="/auth/signin" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Create Account</Link></li>
              </ul>
            </div>

            {/* Support col */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/marketing/contact" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Help &amp; Inquiries</Link></li>
                <li><Link href="/api/health" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">System Health</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} Macrum. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <Link href="/marketing/contact" className="hover:text-zinc-400 transition-colors">Contact</Link>
              <Link href="/marketing/contact" className="hover:text-zinc-400 transition-colors">Privacy &amp; Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Scroll-reveal activator ── */}
      <RevealActivator />
    </div>
  )
}

function RevealActivator() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible")
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return null
}
