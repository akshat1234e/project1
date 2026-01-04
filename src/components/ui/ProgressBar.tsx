"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

    return (
        <div className={`h-1 w-full bg-[#E5E5E5] ${className}`}>
            <motion.div
                className="h-full bg-[#111111]"
                initial={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
            />
        </div>
    );
}
