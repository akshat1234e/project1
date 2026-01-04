"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Status = "SUBMITTED" | "PROCESSING" | "COMPLETED" | "FAILED";

interface StatusIndicatorProps {
    status: Status;
    className?: string;
}

const colors = {
    SUBMITTED: "bg-[#6B6B6B]",
    PROCESSING: "bg-[#8A5A00] animate-pulse",
    COMPLETED: "bg-[#0F5132]",
    FAILED: "bg-[#7A1E1E]",
};

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("h-2 w-2 rounded-full", colors[status])} />
            <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-tight">
                {status}
            </span>
        </div>
    );
}
