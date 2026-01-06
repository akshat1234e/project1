"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Verdict = "PROCEED" | "FIX" | "KILL";

interface VerdictBlockProps {
    verdict: Verdict;
    reason: string;
    score?: number;
    className?: string;
}

const colors = {
    PROCEED: "var(--verdict-proceed)",
    FIX: "var(--verdict-fix)",
    KILL: "var(--verdict-kill)",
};

export function VerdictBlock({ verdict, reason, score, className }: VerdictBlockProps) {
    return (
        <div
            className={cn("p-12 bg-white/5 border-l-8 backdrop-blur-md relative overflow-hidden", className)}
            style={{ borderColor: colors[verdict] }}
        >
            {score !== undefined && (
                <div className="absolute top-0 right-0 p-8 text-right">
                    <div className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1">VC Score</div>
                    <div className="text-6xl font-black text-white tracking-tighter text-glow">
                        {score}<span className="text-2xl text-muted">/100</span>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-6 mb-6">
                <h2
                    className="text-5xl font-black uppercase tracking-tighter text-glow"
                    style={{ color: colors[verdict] }}
                >
                    VERDICT: {verdict}
                </h2>
            </div>
            <p className="text-xl text-white leading-relaxed font-bold tracking-tight max-w-2xl">
                {reason}
            </p>
            <p className="mt-8 text-[10px] text-muted uppercase tracking-[0.3em] font-black">
                This verdict is final for this submission.
            </p>
        </div>
    );
}
