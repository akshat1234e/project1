"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    variant?: "default" | "warning";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, variant = "default", ...props }, ref) => {
        return (
            <label className={cn(
                "flex items-start gap-4 cursor-pointer group select-none",
                variant === "warning" && "p-6 glass border-glow",
                className
            )}>
                <div className="relative flex items-center justify-center mt-1">
                    <input
                        type="checkbox"
                        ref={ref}
                        className="peer sr-only"
                        {...props}
                    />
                    <div className={cn(
                        "h-6 w-6 border-2 transition-all rounded-none backdrop-blur-md",
                        "border-white/20 bg-white/5",
                        "peer-checked:bg-accent peer-checked:border-accent peer-checked:shadow-[0_0_15px_rgba(0,242,255,0.5)]",
                        "group-hover:border-accent/50"
                    )} />
                    <svg
                        className="absolute h-4 w-4 text-background opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <span className="text-sm text-muted group-hover:text-white transition-colors leading-relaxed tracking-wide">
                    {label}
                </span>
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";
