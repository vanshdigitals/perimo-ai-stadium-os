import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/utils/cn"

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = id || props.name

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-semibold text-[#344055] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "w-full h-12 pl-4 pr-11 border border-surface-border rounded-lg text-base font-sans text-text bg-white",
              "focus:outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10 transition-shadow",
              "placeholder:text-[#A9AFBC]",
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-0 h-12 flex items-center bg-transparent border-none cursor-pointer p-0 text-text-muted hover:text-text transition-colors"
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
