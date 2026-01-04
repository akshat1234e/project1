"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Verdict = "PROCEED" | "FIX" | "KILL";

interface VerdictBadgeProps {
    verdict: Verdict;
    className?: string;
}

const colors = {
    PROCEED: "bg-[#0F5132] text-white",
    FIX: "bg-[#8A5A00] text-white",
    KILL: "bg-[#7A1E1E] text-white",
};

export function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center px-3 py-1 text-xs font-bold tracking-wider rounded-none",
            colors[verdict],
            className
        )}>
            {verdict}
        </span>
    );
}
