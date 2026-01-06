"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Status = "SUBMITTED" | "PROCESSING" | "COMPLETED" | "FAILED";

interface StatusIndicatorProps {
    status: Status;
    className?: string;
}

const colors = {
    SUBMITTED: "bg-muted shadow-[0_0_10px_rgba(161,161,170,0.3)]",
    PROCESSING: "bg-verdict-fix animate-pulse shadow-[0_0_15px_rgba(255,184,0,0.5)]",
    COMPLETED: "bg-verdict-proceed shadow-[0_0_15px_rgba(0,255,157,0.5)]",
    FAILED: "bg-verdict-kill shadow-[0_0_15px_rgba(255,0,77,0.5)]",
};

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className={cn("h-2.5 w-2.5 rounded-none", colors[status])} />
            <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                {status}
            </span>
        </div>
    );
}
