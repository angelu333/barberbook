"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "lg"
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg transition-all",
          "before:absolute before:inset-0 before:animate-[gradient_4s_ease-in-out_infinite] before:bg-[length:200%_200%] before:bg-[linear-gradient(90deg,theme(colors.primary.DEFAULT/0.5),theme(colors.primary.DEFAULT/0.2),theme(colors.primary.DEFAULT/0.5))] before:opacity-70 before:blur-xl",
          "after:absolute after:inset-[2px] after:rounded-[7px] after:transition-all",
          variant === "default" 
            ? "after:bg-primary text-primary-foreground hover:before:opacity-100" 
            : "after:bg-background text-foreground hover:before:opacity-85",
          size === "default" ? "h-14 px-6 text-lg" : "h-16 px-8 text-xl",
          "font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative">{children}</span>
      </button>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton } 