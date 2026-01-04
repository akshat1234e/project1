"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isMagnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isMagnetic = false, ...props }, ref) => {
        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
        const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

        function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
            if (!isMagnetic) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            x.set(event.clientX - centerX);
            y.set(event.clientY - centerY);
        }

        function handleMouseLeave() {
            x.set(0);
            y.set(0);
        }

        const variants = {
            primary: "bg-[#111111] text-white hover:bg-[#2E2E2E]",
            secondary: "bg-[#6B6B6B] text-white hover:bg-[#111111]",
            outline: "border-2 border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white",
            ghost: "bg-transparent text-[#111111] hover:bg-[#111111]/10",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 h-[56px] text-lg",
        };

        return (
            <motion.button
                ref={ref}
                style={{ x: mouseX, y: mouseY }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] disabled:bg-[#E5E5E5] disabled:text-[#6B6B6B] disabled:cursor-not-allowed rounded-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
