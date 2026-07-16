import React from 'react'
import { Header } from '@/components/layouts/Header'

interface AuthLayoutProps {
  children: React.ReactNode
  wide?: boolean
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, wide }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle font-sans text-text">
      <Header theme="light" />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-[clamp(24px,5vw,48px)_clamp(20px,5vw,24px)]">
          <div className={`w-full ${wide ? 'max-w-[440px] lg:max-w-[920px]' : 'max-w-[440px]'} animate-perimo-fade`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
