import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark'
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-[15px] font-semibold font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
          "h-12 px-7",
          {
            'bg-brand text-white hover:bg-brand-hover': variant === 'primary',
            'bg-[#1B212C] text-text-light hover:bg-[#232838] border border-[#232838]': variant === 'secondary',
            'border border-surface-border bg-white text-text hover:bg-surface-subtle': variant === 'outline',
            'bg-transparent hover:bg-surface-subtle text-text': variant === 'ghost',
            'bg-brand-dark text-white hover:bg-brand-darkHover': variant === 'dark',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
