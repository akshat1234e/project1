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
                        "flex h-[48px] w-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-base transition-all placeholder:text-[#6B6B6B] focus:border-[#111111] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-none",
                        icon && "pl-12",
                        error && "border-[#7A1E1E] focus:border-[#7A1E1E]",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";
