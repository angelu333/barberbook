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
          "group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg transition-all",
          "before:absolute before:inset-0 before:animate-[gradient_4s_ease-in-out_infinite] before:bg-[length:200%_200%] before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 before:opacity-100 before:blur-xl before:transition-all",
          "after:absolute after:inset-[2px] after:rounded-[7px] after:transition-all",
          variant === "default" 
            ? "after:bg-primary hover:after:bg-primary/90" 
            : "after:bg-background hover:after:bg-background/90",
          size === "default" ? "h-14 px-6 text-lg" : "h-16 px-8 text-xl",
          "font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className={cn(
          "relative z-10",
          variant === "default" ? "text-primary-foreground" : "text-foreground"
        )}>
          {children}
        </span>
      </button>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton } 