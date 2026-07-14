import * as React from "react"
import { cn } from "@/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-semibold text-[#344055] mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "w-full h-12 px-4 border border-surface-border rounded-lg text-base font-sans text-text bg-white",
            "focus:outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10 transition-shadow",
            "placeholder:text-[#A9AFBC]",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
