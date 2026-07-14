import React from 'react'

export const Divider: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-surface-border"></div>
      <span className="text-xs text-text-muted">or</span>
      <div className="flex-1 h-px bg-surface-border"></div>
    </div>
  )
}
