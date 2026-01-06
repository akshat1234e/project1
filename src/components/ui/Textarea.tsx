"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-[120px] w-full border border-white/10 bg-white/5 px-4 py-3 text-base text-white transition-all placeholder:text-muted focus:border-accent focus:bg-white/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-none resize-none backdrop-blur-md",
                    error && "border-verdict-kill focus:border-verdict-kill",
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";
