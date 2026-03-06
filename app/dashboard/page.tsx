'use client';

import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/Sidebar';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import {
    FileText,
    Bookmark,
    Star,
    Archive,
    TrendingUp,
    Calendar,
    Lock,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
    const { isGuest, user } = useAuthStore();

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const { data } = await api.get('/analytics');
            return data;
        },
        enabled: !isGuest
    });

    const stats = [
        { name: 'Total Notes', value: isGuest ? 0 : (analytics?.summary.totalNotes || 0), icon: FileText, color: 'from-blue-500 to-cyan-500', href: '/notes' },
        { name: 'Bookmarks', value: isGuest ? 0 : (analytics?.summary.totalBookmarks || 0), icon: Bookmark, color: 'from-purple-500 to-pink-500', href: '/bookmarks' },
        { name: 'Favorites', value: isGuest ? 0 : (analytics?.summary.favorites || 0), icon: Star, color: 'from-amber-500 to-orange-500', href: '/notes' },
        { name: 'Archived', value: isGuest ? 0 : (analytics?.summary.archived || 0), icon: Archive, color: 'from-slate-500 to-slate-600', href: '/notes' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 to-transparent dark:from-primary/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.header variants={itemVariants} className="mb-10">
                        <h1 className="text-4xl font-display font-bold mb-2">
                            {isGuest ? 'Welcome, Guest!' : `Welcome back, ${user?.name?.split(' ')[0]}!`}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {isGuest ? "Explore NeuroNest. Sign in to save your data." : "Here's an overview of your workspace."}
                        </p>
                    </motion.header>

                    {/* Stats Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((stat, i) => (
                            <Link key={stat.name} href={stat.href} className="block">
                                <div className="glass p-6 rounded-2xl flex items-center gap-4 card-hover group cursor-pointer">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        ))}
                    </motion.div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Activity Chart */}
                        <motion.div
                            variants={itemVariants}
                            className="glass p-6 rounded-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Activity</h2>
                                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={isGuest ? [] : analytics?.activity || []}>
                                        <defs>
                                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 600 }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} fill="url(#colorActivity)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            {isGuest && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center z-10 text-center p-6 rounded-2xl">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Lock className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Activity Locked</h3>
                                    <p className="text-sm text-muted-foreground mb-5 max-w-xs">Sign in to track your productivity patterns over time.</p>
                                    <Link href="/login">
                                        <Button variant="gradient" size="sm">Sign In</Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Tags Chart */}
                        <motion.div
                            variants={itemVariants}
                            className="glass p-6 rounded-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Top Tags</h2>
                                        <p className="text-xs text-muted-foreground">Most used topics</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={isGuest ? [] : analytics?.topTags || []} layout="vertical">
                                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="var(--primary)">
                                            {(analytics?.topTags || []).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={`hsl(var(--ring) / ${1 - index * 0.15})`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            {isGuest && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center z-10 text-center p-6 rounded-2xl">
                                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                                        <Sparkles className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Tags Locked</h3>
                                    <p className="text-sm text-muted-foreground mb-5 max-w-xs">Discover your favorite topics after creating an account.</p>
                                    <Link href="/register">
                                        <Button variant="gradient" size="sm">Create Account</Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
