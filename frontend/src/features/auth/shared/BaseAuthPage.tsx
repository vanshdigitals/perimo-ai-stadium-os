import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

interface BaseAuthPageProps {
  children: React.ReactNode
  icon: React.ReactNode
  badgeText: string
  title: string
  subtitle: string
  footerText: string
  iconWrapperClass?: string
  errorMsg?: string
}

export const BaseAuthPage: React.FC<BaseAuthPageProps> = ({
  children,
  icon,
  badgeText,
  title,
  subtitle,
  footerText,
  iconWrapperClass = "bg-surface-subtle text-text-muted",
  errorMsg
}) => {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-1.5 text-text-muted text-sm cursor-pointer mb-5 w-fit hover:text-text transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to role selection
      </div>

      <div className="bg-white border border-surface-border rounded-2xl p-[clamp(28px,5vw,40px)_clamp(24px,5vw,36px)] shadow-[0_1px_2px_rgba(10,14,20,0.06)]">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${iconWrapperClass}`}>
            {icon}
          </div>
          <span className="text-xs font-semibold tracking-[0.03em] text-text-muted bg-surface-subtle px-3 py-1.5 rounded-full">
            {badgeText}
          </span>
        </div>

        <h1 className="font-display font-semibold text-2xl text-text mb-2">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-text-muted mb-6">
          {subtitle}
        </p>

        {errorMsg && (
          <div className="flex gap-2.5 items-start bg-[#C4291C]/10 border-l-[3px] border-[#C4291C] rounded-lg py-3 px-3.5 mb-5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-px">
              <circle cx="12" cy="12" r="9" stroke="#C4291C" strokeWidth="1.5"/>
              <path d="M12 7.5v5.5" stroke="#C4291C" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16.2" r="1" fill="#C4291C"/>
            </svg>
            <span className="text-[13px] leading-[1.5] text-[#8f2015]">{errorMsg}</span>
          </div>
        )}

        {children}

      </div>
      
      <p className="text-center text-[13px] text-text-muted mt-5 leading-[1.5]">
        {footerText}
      </p>
    </AuthLayout>
  )
}
