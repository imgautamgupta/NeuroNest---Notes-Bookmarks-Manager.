'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '@/components/Sidebar';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeleteModal } from '@/components/DeleteModal';
import {
    Plus,
    Search,
    Tag as TagIcon,
    Trash2,
    ExternalLink,
    Globe,
    Lock,
    X,
    Bookmark as BookmarkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';

export default function BookmarksPage() {
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newBookmark, setNewBookmark] = useState({ url: '', tags: '' });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { isGuest } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: bookmarksData, isLoading } = useQuery({
        queryKey: ['bookmarks', search],
        queryFn: async () => {
            const { data } = await api.get(`/bookmarks?q=${search}`);
            return data;
        },
        enabled: !isGuest
    });

    const createBookmarkMutation = useMutation({
        mutationFn: async (bookmark: { url: string; tags: string }) => {
            const tagsArray = bookmark.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
            const response = await api.post('/bookmarks', { url: bookmark.url, tags: tagsArray });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
            setIsCreating(false);
            setNewBookmark({ url: '', tags: '' });
            setError('');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to save bookmark. Please try again.');
        }
    });

    const deleteBookmarkMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/bookmarks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
            setDeleteId(null);
        }
    });

    const handleSaveBookmark = () => {
        if (!newBookmark.url.trim()) {
            setError('Please enter a URL');
            return;
        }
        // Basic URL validation
        try {
            new URL(newBookmark.url);
        } catch {
            setError('Please enter a valid URL (include https://)');
            return;
        }
        setError('');
        createBookmarkMutation.mutate(newBookmark);
    };

    const handleCreateClick = () => {
        if (isGuest) {
            setShowLoginModal(true);
        } else {
            setIsCreating(true);
        }
    };

    const handleCloseModal = () => {
        setIsCreating(false);
        setNewBookmark({ url: '', tags: '' });
        setError('');
    };

    // Mock data for guest mode
    const guestBookmarks = [
        { _id: '1', title: 'Next.js Documentation', url: 'https://nextjs.org', description: 'The React Framework for the Web. Used by some of the world\'s largest companies.', tags: ['dev', 'react'], createdAt: new Date() },
        { _id: '2', title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Rapidly build modern websites without ever leaving your HTML.', tags: ['css', 'ui'], createdAt: new Date() },
        { _id: '3', title: 'Framer Motion', url: 'https://framer.com/motion', description: 'A production-ready motion library for React.', tags: ['animation', 'react'], createdAt: new Date() },
    ];

    const displayBookmarks = isGuest ? guestBookmarks : (bookmarksData?.bookmarks || []);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/5 to-transparent dark:from-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-display font-bold mb-1">Bookmarks</h1>
                            <p className="text-muted-foreground">Save links with automatic metadata extraction.</p>
                        </div>
                        <Button onClick={handleCreateClick} variant="gradient" icon={<Plus className="w-5 h-5" />}>
                            Add Bookmark
                        </Button>
                    </header>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search bookmarks..."
                            className="w-full h-13 pl-12 pr-4 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Check login modal */}
                    <AnimatePresence>
                        {showLoginModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
                                onClick={() => setShowLoginModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="glass w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center glow relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginModal(false)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="w-20 h-20 animated-gradient rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                                        <Lock className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
                                    <p className="text-muted-foreground mb-6 text-sm">Create an account to save and organize your bookmarks.</p>
                                    <div className="space-y-3">
                                        <Link href="/login" className="block">
                                            <Button variant="gradient" fullWidth size="lg">Sign In</Button>
                                        </Link>
                                        <Link href="/register" className="block">
                                            <Button variant="outline" fullWidth>Create Account</Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Delete Confirmation Modal */}
                    <DeleteModal
                        isOpen={!!deleteId}
                        onClose={() => setDeleteId(null)}
                        onConfirm={() => deleteId && deleteBookmarkMutation.mutate(deleteId)}
                        title="Delete Bookmark"
                        description="Are you sure you want to delete this bookmark? This action cannot be undone."
                        isDeleting={deleteBookmarkMutation.isPending}
                    />

                    {/* Create Bookmark Modal */}
                    <AnimatePresence>
                        {isCreating && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
                                onClick={handleCloseModal}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className="glass w-full max-w-lg p-8 rounded-3xl shadow-2xl relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 animated-gradient rounded-t-3xl" />
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <h2 className="text-2xl font-bold mb-6">Add Bookmark</h2>
                                    <div className="space-y-5">
                                        <Input
                                            label="URL"
                                            placeholder="https://example.com"
                                            icon={<Globe className="w-5 h-5 text-muted-foreground" />}
                                            value={newBookmark.url}
                                            onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                                        />
                                        <Input
                                            label="Tags"
                                            icon={<TagIcon className="w-5 h-5 text-muted-foreground" />}
                                            value={newBookmark.tags}
                                            placeholder="Separate tags with commas"
                                            onChange={(e) => setNewBookmark({ ...newBookmark, tags: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            💡 We'll automatically fetch the title, description, and preview image.
                                        </p>

                                        {error && (
                                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl text-center font-medium">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3 mt-8">
                                        <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                                        <Button
                                            variant="gradient"
                                            loading={createBookmarkMutation.isPending}
                                            onClick={handleSaveBookmark}
                                        >
                                            Save Bookmark
                                        </Button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bookmarks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayBookmarks.map((bookmark: any, i: number) => (
                            <motion.div
                                key={bookmark._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass rounded-2xl group card-hover overflow-hidden"
                            >
                                {/* Preview Image Area */}
                                <div className="h-36 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 relative overflow-hidden flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    {!isGuest && (
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => setDeleteId(bookmark._id)}
                                                className="p-2 bg-card/90 backdrop-blur-md rounded-lg text-muted-foreground hover:text-destructive shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 truncate">
                                        {(() => { try { return new URL(bookmark.url).hostname.replace('www.', ''); } catch { return 'website'; } })()}
                                    </p>

                                    <h3 className="font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                                        {bookmark.title || 'Untitled'}
                                    </h3>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                                        {bookmark.description || "No description available."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(bookmark.tags || []).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[11px] font-semibold">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
                                            {format(new Date(bookmark.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline group/link"
                                        >
                                            Visit <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {!isLoading && displayBookmarks.length === 0 && !isGuest && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                                <BookmarkIcon className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
                            <p className="text-muted-foreground mb-6">Save your first link to get started!</p>
                            <Button onClick={() => setIsCreating(true)} variant="gradient" icon={<Plus className="w-5 h-5" />}>
                                Add Bookmark
                            </Button>
                        </div>
                    )}

                    {isLoading && !isGuest && (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
