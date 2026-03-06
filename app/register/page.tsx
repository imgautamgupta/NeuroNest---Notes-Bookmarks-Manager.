'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setUser(data);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        'Unlimited notes & bookmarks',
        'AI-powered summaries',
        'Secure cloud sync',
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-40%] right-[-20%] w-[900px] h-[900px] bg-gradient-to-tl from-primary/15 to-purple-500/15 dark:from-primary/30 dark:to-purple-500/30 rounded-full blur-[150px] pulse-glow" />
                <div className="absolute top-[-40%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-br from-pink-500/15 to-primary/15 dark:from-pink-500/30 dark:to-primary/30 rounded-full blur-[150px] pulse-glow" style={{ animationDelay: '2s' }} />
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
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold">Create Account</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Join thousands on NeuroNest</p>
                    </div>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {benefits.map((benefit) => (
                            <span key={benefit} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                {benefit}
                            </span>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            icon={<User className="w-5 h-5 text-muted-foreground" />}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                        <Input
                            label="Email Address"
                            icon={<Mail className="w-5 h-5 text-muted-foreground" />}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            icon={<Lock className="w-5 h-5 text-muted-foreground" />}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

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
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline font-bold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
