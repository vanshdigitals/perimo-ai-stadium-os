import React from 'react'
import { cn } from '@/utils/cn'

interface BackdropProps {
  isOpen: boolean
  onClick: () => void
}

export const Backdrop: React.FC<BackdropProps> = ({ isOpen, onClick }) => {
  if (!isOpen) return null

  return (
    <div 
      onClick={onClick}
      className={cn(
        "fixed inset-0 top-[72px] z-[900] bg-[#0F172A]/20 backdrop-blur-[10px]",
        "animate-in fade-in duration-200" // Desktop + Mobile
      )}
    />
  )
}


