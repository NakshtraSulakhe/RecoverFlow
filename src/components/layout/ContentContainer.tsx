import React from 'react'
import { cn } from '../../utils/cn'

export interface ContentContainerProps {
  children: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  disablePadding?: boolean
  paper?: boolean
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  maxWidth = 'xl',
  disablePadding = false,
  paper = false,
}) => {
  const maxWidthClass = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
  }

  const content = (
    <div className={cn(
      "w-full mx-auto px-4 sm:px-6 lg:px-8",
      maxWidth ? maxWidthClass[maxWidth] : 'max-w-none'
    )}>
      <div className={cn(disablePadding ? "py-0" : "py-4 sm:py-6")}>
        {children}
      </div>
    </div>
  )

  if (paper) {
    return (
      <div className={cn(disablePadding ? "p-0" : "p-6")}>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {content}
        </div>
      </div>
    )
  }

  return content
}
export default ContentContainer
