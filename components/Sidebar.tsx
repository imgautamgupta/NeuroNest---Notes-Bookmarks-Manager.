'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
    LayoutDashboard,
    FileText,
    Bookmark,
    LogOut,
    Moon,
    Sun,
    UserCircle,
    LogIn,
    Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, isGuest } = useAuthStore();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border p-6 flex flex-col z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 animated-gradient rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-lg">
                    N
                </div>
                <h1 className="text-2xl font-display font-bold tracking-tight">NeuroNest</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} className="block">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group cursor-pointer",
                                isActive
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                                        transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                                    />
                                )}
                                <item.icon className={cn("w-5 h-5 relative z-10", isActive && "text-primary")} />
                                <span className="relative z-10">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 border-t border-border space-y-4">
                {/* Theme Toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all font-medium text-sm"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                {isGuest ? (
                    /* Guest State - Login Prompt */
                    <Link href="/login" className="block">
                        <div className="gradient-border p-[1px] rounded-xl">
                            <div className="px-4 py-4 flex items-center gap-3 bg-card rounded-xl hover:bg-accent transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground">Sign In</p>
                                    <p className="text-xs text-muted-foreground">to save your data</p>
                                </div>
                                <LogIn className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </Link>
                ) : (
                    /* Logged-in State */
                    <div className="space-y-3">
                        <div className="px-4 py-3 flex items-center gap-3 bg-secondary/50 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                                {user?.name?.[0]?.toUpperCase() || <UserCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-all font-medium text-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
                <p className="text-[10px] text-center text-muted-foreground mt-6 font-medium opacity-60 tracking-wide">
                    Where your knowledge lives.
                </p>
            </div>
        </aside>
    );
}
