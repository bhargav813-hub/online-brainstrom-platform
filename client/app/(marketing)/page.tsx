'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import {
  Zap, TreePine, Users, BarChart3, Vote, Layers,
  ArrowRight, Sparkles, Shield, Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: TreePine,
    title: 'Hierarchical Ideas',
    description: 'Organize thoughts into nested trees. Build on existing ideas with threaded replies.',
  },
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    description: 'See ideas appear instantly. Socket-powered live updates keep everyone in sync.',
  },
  {
    icon: Vote,
    title: 'Weighted Voting',
    description: 'Democratic idea evaluation with upvotes and downvotes. Surface the best ideas.',
  },
  {
    icon: Layers,
    title: 'Smart Clustering',
    description: 'Group related ideas into themed clusters. Color-code and tag for easy navigation.',
  },
  {
    icon: BarChart3,
    title: 'Live Analytics',
    description: 'Track participation, vote distributions, and top-performing ideas in real time.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Fine-grained permissions for admins, facilitators, reviewers, and participants.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const { isAuthenticated, isHydrating } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      router.replace(ROUTES.WORKSPACES);
    }
  }, [isAuthenticated, isHydrating, router]);

  // While hydrating or if authenticated (about to redirect), show nothing
  if (isHydrating || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-lg glow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">
              Brainstorm<span className="gradient-text">Hub</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button size="sm" className="gradient-primary text-white border-0 shadow-lg glow-sm hover:opacity-90 transition-opacity">
                Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center relative">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Collaborative brainstorming, reimagined
            </div>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-heading leading-[1.1]"
          >
            Turn ideas into
            <br />
            <span className="gradient-text">brilliant outcomes</span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Structure your team&apos;s brainstorming with hierarchical idea trees,
            real-time collaboration, weighted voting, and powerful analytics.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" className="gradient-primary text-white border-0 shadow-xl glow hover:opacity-90 transition-opacity text-base px-8">
                Start Brainstorming <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button size="lg" variant="outline" className="text-base px-8">
                Log In
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-accent/30">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-heading">
              Everything you need to <span className="gradient-text">ideate together</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From brainstorming to decision-making, BrainstormHub provides the tools your team needs.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:gradient-primary group-hover:text-white transition-all duration-300 mb-4">
                  <feature.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold font-heading">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="mx-auto max-w-3xl px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-heading">
              Ready to brainstorm?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create your first workspace in seconds and invite your team.
            </p>
            <div className="mt-8">
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" className="gradient-primary text-white border-0 shadow-xl glow text-base px-10">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>BrainstormHub</span>
          </div>
          <p>© {new Date().getFullYear()} BrainstormHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
