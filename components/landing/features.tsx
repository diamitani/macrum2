import { CheckCircle, Users, Calendar, BarChart3, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Smart Task Management",
    description: "Organize, prioritize, and track tasks with intelligent automation and customizable workflows.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates, comments, and file sharing capabilities.",
  },
  {
    icon: Calendar,
    title: "Timeline Planning",
    description: "Visualize project timelines, set deadlines, and never miss important milestones.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track productivity, identify bottlenecks, and make data-driven decisions.",
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Automate repetitive tasks and workflows to focus on what matters most.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with SSO, 2FA, and compliance with industry standards.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to manage tasks effectively
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to streamline your workflow and boost team productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
