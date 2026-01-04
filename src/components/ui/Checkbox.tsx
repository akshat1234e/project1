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
                "flex items-start gap-3 cursor-pointer group select-none",
                variant === "warning" && "p-4 bg-[#FFF8E1] border border-[#8A5A00]",
                className
            )}>
                <div className="relative flex items-center justify-center mt-0.5">
                    <input
                        type="checkbox"
                        ref={ref}
                        className="peer sr-only"
                        {...props}
                    />
                    <div className={cn(
                        "h-5 w-5 border-2 transition-all rounded-none",
                        variant === "default" ? "border-[#111111]" : "border-[#8A5A00]",
                        "peer-checked:bg-[#111111] peer-checked:border-[#111111]",
                        "group-hover:border-[3px]"
                    )} />
                    <svg
                        className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
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
                <span className="text-sm text-[#111111] leading-tight">
                    {label}
                </span>
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";
