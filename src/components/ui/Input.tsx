"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, error, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex h-[48px] w-full border border-white/10 bg-white/5 px-4 py-2 text-base transition-all placeholder:text-muted focus:border-accent focus:bg-white/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-none backdrop-blur-md",
                        icon && "pl-12",
                        error && "border-verdict-kill focus:border-verdict-kill",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";
