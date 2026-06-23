import Link from 'next/link';
import { Zap, Lightbulb, Users, BarChart3, Layers, Shield, ArrowRight, Sparkles, Globe } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Lightbulb,
      title: 'Hierarchical Ideas',
      description: 'Build idea trees with unlimited nesting. Organize thoughts as parent-child relationships for structured brainstorming.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Real-Time Collaboration',
      description: 'See ideas appear instantly as your team types. Live presence tracking shows who is active in each session.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Structured Voting',
      description: 'Weighted upvote and downvote system lets teams prioritize the best ideas with transparent analytics.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Layers,
      title: 'Smart Clustering',
      description: 'Group related ideas into color-coded clusters with tags. Instantly see patterns and themes emerge.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Fine-grained permissions for participants, facilitators, reviewers, and admins keep your workspace secure.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Share Publicly',
      description: 'Generate share links to let anyone view your board. Perfect for presenting finalized brainstorm results.',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Brainstorm
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/20 dark:via-background dark:to-indigo-950/20" />
        <div className="absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-muted-foreground">Real-time collaborative brainstorming</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Turn Ideas Into{' '}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Action
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              A structured platform for teams to brainstorm, organize, vote, and cluster ideas in real-time.
              Build hierarchical idea trees, see live collaboration, and let the best ideas rise to the top.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Start Brainstorming Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border px-8 text-base font-semibold transition-all hover:bg-muted hover:-translate-y-0.5"
              >
                Sign in to your workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                brainstorm better
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Purpose-built tools for structured ideation, real-time collaboration, and transparent decision-making.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From idea to action in four simple steps
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Create a Workspace', desc: 'Set up your team workspace and invite members with specific roles.' },
              { step: '02', title: 'Start a Session', desc: 'Create boards and launch brainstorming sessions for your team.' },
              { step: '03', title: 'Share Ideas', desc: 'Add ideas in real-time. Build on others\' ideas with nested responses.' },
              { step: '04', title: 'Vote & Decide', desc: 'Use weighted voting to prioritize. Cluster ideas and export results.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                  <span className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-6 py-16 text-center shadow-2xl sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to brainstorm?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join teams already using Brainstorm Platform to turn ideas into structured, actionable outcomes.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-semibold text-violet-700 shadow-xl transition-all hover:bg-white/90 hover:-translate-y-0.5"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Brainstorm Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Brainstorm Platform. Built for teams that think big.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
