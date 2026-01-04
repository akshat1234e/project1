import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "verdict";
    verdict?: "proceed" | "fix" | "kill";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", verdict, ...props }, ref) => {
        const verdictStyles = {
            proceed: "border-verdict-proceed text-verdict-proceed",
            fix: "border-verdict-fix text-verdict-fix",
            kill: "border-verdict-kill text-verdict-kill",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "border border-foreground/10 bg-background p-8",
                    variant === "verdict" && verdict && cn("border-2", verdictStyles[verdict]),
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";
