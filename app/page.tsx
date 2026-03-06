'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Sparkles, Shield, Zap, Layout, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGuestAccess = () => {
    loginAsGuest();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-full blur-[120px] pulse-glow" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[700px] h-[700px] bg-gradient-to-r from-pink-500/10 to-primary/10 dark:from-pink-500/20 dark:to-primary/20 rounded-full blur-[120px] pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 animated-gradient rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-lg">
            N
          </div>
          <span className="text-xl font-display font-bold">NeuroNest</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="gradient" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Productivity Suite
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-tight">
            Organize Your<br />
            <span className="gradient-text">Digital Universe</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            NeuroNest is a stunning, secure, and intelligent workspace for managing your notes and bookmarks.
            <span className="text-foreground font-medium"> Powered by AI</span> to help you work smarter, not harder.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="h-14 px-10 text-base rounded-2xl group min-w-[200px]">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-10 text-base rounded-2xl min-w-[200px]" onClick={handleGuestAccess}>
              Try as Guest
            </Button>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            No credit card required • Free forever for personal use
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              title: 'AI Summarization',
              description: 'Get instant summaries and auto-generated tags for your notes using cutting-edge AI.',
              icon: Zap,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Bank-Level Security',
              description: 'Your data is encrypted end-to-end with JWT authentication. Privacy first.',
              icon: Shield,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Smart Bookmarks',
              description: 'Save any URL and we\'ll automatically extract titles, descriptions, and previews.',
              icon: Layout,
              color: 'from-purple-500 to-pink-500'
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-3xl text-left card-hover group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 flex flex-col items-center"
        >
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Loved by <span className="text-foreground font-semibold">1,000+</span> productivity enthusiasts
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2026 NeuroNest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
