'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '@/components/Sidebar';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Editor } from '@/components/Editor';
import { DeleteModal } from '@/components/DeleteModal';
import {
    Plus,
    Search,
    Tag as TagIcon,
    Star,
    Trash2,
    Sparkles,
    Lock,
    X,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import Link from 'next/link';

export default function NotesPage() {
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
    const [useAI, setUseAI] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { isGuest } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: notesData, isLoading } = useQuery({
        queryKey: ['notes', search],
        queryFn: async () => {
            const { data } = await api.get(`/notes?q=${search}`);
            return data;
        },
        enabled: !isGuest
    });

    const createNoteMutation = useMutation({
        mutationFn: async (note: { title: string; content: string; tags: string }) => {
            const tagsArray = note.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
            const response = await api.post('/notes', {
                title: note.title,
                content: note.content,
                tags: tagsArray,
                aiSummary: useAI,
                aiTags: useAI
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            setIsCreating(false);
            setNewNote({ title: '', content: '', tags: '' });
            setError('');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to save note. Please try again.');
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/notes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            setDeleteId(null);
        }
    });

    const handleSaveNote = () => {
        if (!newNote.title.trim()) {
            setError('Please enter a title');
            return;
        }
        if (!newNote.content.trim()) {
            setError('Please enter some content');
            return;
        }
        setError('');
        createNoteMutation.mutate(newNote);
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
        setNewNote({ title: '', content: '', tags: '' });
        setError('');
    };

    // Mock data for guest mode
    const guestNotes = [
        { _id: '1', title: 'Welcome to NeuroNest ✨', content: '<p>This is a sample note to get you started. Try creating your own!</p>', tags: ['welcome', 'getting-started'], isFavorite: true, createdAt: new Date() },
        { _id: '2', title: 'Project Ideas', content: '<ul><li>Build an amazing app</li><li>Learn Next.js 15</li><li>Master Tailwind CSS v4</li></ul>', tags: ['ideas', 'todo'], isFavorite: false, createdAt: new Date() },
        { _id: '3', title: 'Meeting Notes', content: '<p>Discussed roadmap for Q2. Key priorities include user growth and feature development.</p>', tags: ['work', 'meetings'], isFavorite: false, createdAt: new Date() },
    ];

    const displayNotes = isGuest ? guestNotes : (notesData?.notes || []);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/5 to-transparent dark:from-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-display font-bold mb-1">Notes</h1>
                            <p className="text-muted-foreground">Capture your ideas and organize them intelligently.</p>
                        </div>
                        <Button onClick={handleCreateClick} variant="gradient" icon={<Plus className="w-5 h-5" />}>
                            Create Note
                        </Button>
                    </header>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search notes by title, content or tags..."
                            className="w-full h-13 pl-12 pr-4 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Login Modal for Guest */}
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
                                    <p className="text-muted-foreground mb-6 text-sm">Create an account to save and sync your notes securely.</p>
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
                        onConfirm={() => deleteId && deleteNoteMutation.mutate(deleteId)}
                        title="Delete Note"
                        description="Are you sure you want to delete this note? This action cannot be undone."
                        isDeleting={deleteNoteMutation.isPending}
                    />

                    {/* Create Note Modal */}
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
                                    className="glass w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 animated-gradient" />
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <h2 className="text-2xl font-bold mb-6">New Note</h2>

                                    <div className="space-y-5">
                                        <Input
                                            label="Title"
                                            placeholder="Give your note a title..."
                                            value={newNote.title}
                                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                        />

                                        <div>
                                            <label className="text-sm font-semibold mb-2 block ml-1">Content</label>
                                            <Editor
                                                content={newNote.content}
                                                onChange={(html) => setNewNote({ ...newNote, content: html })}
                                            />
                                        </div>

                                        <Input
                                            label="Tags"
                                            icon={<TagIcon className="w-5 h-5 text-muted-foreground" />}
                                            placeholder="Separate tags with commas (e.g., work, ideas)"
                                            value={newNote.tags}
                                            onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                                        />

                                        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setUseAI(!useAI)}
                                                className={cn(
                                                    "w-12 h-7 rounded-full transition-colors relative shrink-0",
                                                    useAI ? "bg-primary" : "bg-muted"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow",
                                                    useAI ? "left-6" : "left-1"
                                                )} />
                                            </button>
                                            <Sparkles className="w-5 h-5 text-primary shrink-0" />
                                            <span className="text-sm font-medium">Use AI to generate summary & suggest tags</span>
                                        </div>

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
                                            loading={createNoteMutation.isPending}
                                            onClick={handleSaveNote}
                                        >
                                            Save Note
                                        </Button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayNotes.map((note: any, i: number) => (
                            <motion.div
                                key={note._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass p-6 rounded-2xl group card-hover relative"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-lg line-clamp-1">{note.title}</h3>
                                    </div>
                                    {!isGuest && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" className={cn("p-2 rounded-lg hover:bg-accent", note.isFavorite ? "text-amber-500" : "text-muted-foreground")}>
                                                <Star className="w-4 h-4" fill={note.isFavorite ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteId(note._id)}
                                                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="text-muted-foreground text-sm line-clamp-3 mb-4 prose prose-sm dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: note.content }}
                                />

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {note.tags.map((tag: string) => (
                                        <span key={tag} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[11px] font-semibold">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest pt-3 border-t border-border">
                                    {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {!isLoading && displayNotes.length === 0 && !isGuest && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No notes yet</h3>
                            <p className="text-muted-foreground mb-6">Create your first note to get started!</p>
                            <Button onClick={() => setIsCreating(true)} variant="gradient" icon={<Plus className="w-5 h-5" />}>
                                Create Note
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
