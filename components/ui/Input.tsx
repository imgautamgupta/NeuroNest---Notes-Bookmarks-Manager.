'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

export function Input({
    label,
    icon,
    error,
    className,
    ...props
}: InputProps) {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label className="text-sm font-semibold text-foreground ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 group-focus-within:text-primary">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        "flex h-12 w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        icon && "pl-12",
                        error && "border-destructive focus-visible:ring-destructive/20",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-destructive ml-1 font-medium">{error}</p>}
        </div>
    );
}
