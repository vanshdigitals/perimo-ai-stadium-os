import React, { useEffect } from 'react'
import { cn } from '@/utils/cn'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right'
  width?: string
  collapsedWidth?: string
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  position = 'left', 
  width = 'w-[280px]',
  collapsedWidth = 'w-0',
  children 
}) => {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <aside
      className={cn(
        "fixed top-[72px] bottom-0 z-[1000] bg-white transition-all duration-[250ms] ease-out flex flex-col overflow-hidden",
        position === 'left' ? "left-0 border-r border-[#E2E8F0]" : "right-0 border-l border-[#E2E8F0]",
        isOpen ? width : collapsedWidth,
        isOpen ? "shadow-2xl" : "shadow-none",
        !isOpen && collapsedWidth === 'w-0' && position === 'right' && "translate-x-full border-transparent",
        !isOpen && collapsedWidth === 'w-0' && position === 'left' && "-translate-x-full border-transparent",
        isOpen && "translate-x-0"
      )}
    >
      {children}
    </aside>
  )
}

