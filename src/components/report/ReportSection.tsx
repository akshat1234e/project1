"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface ReportSectionProps {
    title: string;
    content: string;
    className?: string;
}

export function ReportSection({ title, content, className }: ReportSectionProps) {
    return (
        <ScrollReveal>
            <div className={cn("space-y-6", className)}>
                <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
                    {title}
                </h3>
                <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-sm">
                    <p className="text-lg text-white leading-relaxed whitespace-pre-wrap font-medium tracking-tight">
                        {content}
                    </p>
                </div>
            </div>
        </ScrollReveal>
    );
}
