"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Verdict = "PROCEED" | "FIX" | "KILL";

interface VerdictBlockProps {
    verdict: Verdict;
    reason: string;
    className?: string;
}

const colors = {
    PROCEED: "#0F5132",
    FIX: "#8A5A00",
    KILL: "#7A1E1E",
};

export function VerdictBlock({ verdict, reason, className }: VerdictBlockProps) {
    return (
        <div
            className={cn("p-12 bg-white border-l-8 shadow-sm", className)}
            style={{ borderColor: colors[verdict] }}
        >
            <div className="flex items-center gap-6 mb-6">
                <h2
                    className="text-5xl font-bold uppercase tracking-tighter"
                    style={{ color: colors[verdict] }}
                >
                    VERDICT: {verdict}
                </h2>
            </div>
            <p className="text-xl text-[#111111] leading-relaxed font-medium">
                {reason}
            </p>
            <p className="mt-6 text-sm text-[#6B6B6B] uppercase tracking-widest font-bold">
                This verdict is final for this submission.
            </p>
        </div>
    );
}
