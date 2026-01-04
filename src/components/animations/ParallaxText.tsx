"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxTextProps {
    children: string;
    baseVelocity?: number;
    className?: string;
}

export const ParallaxText = ({
    children,
    baseVelocity = 100,
    className = "",
}: ParallaxTextProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, baseVelocity]);

    return (
        <div ref={ref} className={`overflow-hidden whitespace-nowrap ${className}`}>
            <motion.div style={{ x }} className="inline-block">
                {children}
            </motion.div>
        </div>
    );
};
