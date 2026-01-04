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
            <div className={cn("space-y-4", className)}>
                <h3 className="text-sm font-bold text-[#6B6B6B] uppercase tracking-widest">
                    {title}
                </h3>
                <div className="bg-white border border-[#E5E5E5] p-8">
                    <p className="text-lg text-[#111111] leading-relaxed whitespace-pre-wrap">
                        {content}
                    </p>
                </div>
            </div>
        </ScrollReveal>
    );
}
