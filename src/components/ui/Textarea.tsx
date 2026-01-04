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
                    "flex min-h-[120px] w-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-base transition-all placeholder:text-[#6B6B6B] focus:border-[#111111] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-none resize-none",
                    error && "border-[#7A1E1E] focus:border-[#7A1E1E]",
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";
