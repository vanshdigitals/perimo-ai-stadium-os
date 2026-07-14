import React from 'react'
import { cn } from '@/utils/cn'

interface SocialLoginProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider?: 'google'
}

export const SocialLogin = React.forwardRef<HTMLButtonElement, SocialLoginProps>(
  ({ className, provider = 'google', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "w-full h-12 border border-surface-border rounded-lg bg-white text-text font-sans font-semibold text-[15px] cursor-pointer flex items-center justify-center gap-2.5 mb-5 transition-colors hover:bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
          className
        )}
        {...props}
      >
        {provider === 'google' && (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.98v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M3.97 10.71a5.4 5.4 0 010-3.42V4.96H.98a9 9 0 000 8.08l2.99-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.96l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
        )}
        Continue with {provider === 'google' ? 'Google' : 'SSO'}
      </button>
    )
  }
)
SocialLogin.displayName = 'SocialLogin'
