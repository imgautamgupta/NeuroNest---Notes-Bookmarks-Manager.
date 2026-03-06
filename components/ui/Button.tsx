'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    fullWidth = false,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-primary/40',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-primary/50',
        ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/25',
        gradient: 'animated-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02]',
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}
