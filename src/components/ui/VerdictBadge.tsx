"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Verdict = "PROCEED" | "FIX" | "KILL";

interface VerdictBadgeProps {
    verdict: Verdict;
    className?: string;
}

const colors = {
    PROCEED: "bg-verdict-proceed/20 text-verdict-proceed border-verdict-proceed/50 shadow-[0_0_15px_rgba(0,255,157,0.2)]",
    FIX: "bg-verdict-fix/20 text-verdict-fix border-verdict-fix/50 shadow-[0_0_15px_rgba(255,184,0,0.2)]",
    KILL: "bg-verdict-kill/20 text-verdict-kill border-verdict-kill/50 shadow-[0_0_15px_rgba(255,0,77,0.2)]",
};

export function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center px-4 py-1 text-[10px] font-black tracking-[0.2em] rounded-none border uppercase",
            colors[verdict],
            className
        )}>
            {verdict}
        </span>
    );
}
