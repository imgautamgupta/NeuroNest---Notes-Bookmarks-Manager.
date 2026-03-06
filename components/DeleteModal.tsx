'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/Button';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isDeleting?: boolean;
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, description, isDeleting }: DeleteModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass w-full max-w-sm p-6 rounded-3xl shadow-2xl relative z-10 border-destructive/20 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>

                        <h2 className="text-xl font-bold mb-2">{title}</h2>
                        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                            {description}
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={onClose}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                fullWidth
                                onClick={onConfirm}
                                loading={isDeleting}
                                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-red-500 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
