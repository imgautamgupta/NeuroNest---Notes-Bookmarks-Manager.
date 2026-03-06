'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn, Mail, Lock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const loginAsGuest = useAuthStore((state) => state.loginAsGuest);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-40%] right-[-20%] w-[900px] h-[900px] bg-gradient-to-br from-primary/15 to-purple-500/15 dark:from-primary/30 dark:to-purple-500/30 rounded-full blur-[150px] pulse-glow" />
                <div className="absolute bottom-[-40%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/15 to-primary/15 dark:from-pink-500/30 dark:to-primary/30 rounded-full blur-[150px] pulse-glow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(129,140,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back Button */}
                <Link href="/" className="absolute -top-16 left-0 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Card */}
                <div className="glass p-8 sm:p-10 rounded-3xl shadow-2xl glow">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 animated-gradient rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-xl">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Sign in to continue to NeuroNest</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            icon={<Mail className="w-5 h-5 text-muted-foreground" />}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <div>
                            <Input
                                label="Password"
                                icon={<Lock className="w-5 h-5 text-muted-foreground" />}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="gradient"
                            fullWidth
                            size="lg"
                            loading={loading}
                            className="rounded-xl h-13 text-base"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Or</span>
                        <div className="h-px bg-border flex-1" />
                    </div>

                    <div className="mt-6 space-y-4">
                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="w-full flex items-center justify-center gap-3 h-13 rounded-xl border-2 border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm font-semibold group"
                        >
                            <Sparkles className="w-5 h-5 text-primary" />
                            Continue as Guest
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:underline font-bold">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
