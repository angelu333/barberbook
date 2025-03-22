"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "lg"
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-lg transition-all",
          "before:absolute before:inset-0 before:animate-[gradient_4s_ease-in-out_infinite] before:bg-[length:200%_200%] before:bg-[linear-gradient(90deg,#ff0000,#00ff00,#0000ff,#ff0000)] before:opacity-70 before:blur-xl",
          "after:absolute after:inset-[2px] after:rounded-[7px] after:bg-background",
          size === "default" ? "h-14 px-6 text-lg" : "h-16 px-8 text-xl",
          variant === "default" 
            ? "text-primary-foreground hover:before:opacity-100" 
            : "text-foreground hover:before:opacity-85",
          "font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton } 