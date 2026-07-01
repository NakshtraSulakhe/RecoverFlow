import React from 'react'
import { 
  FolderOpen, 
  SearchCode, 
  MousePointerClick, 
  AlertTriangle, 
  Lock, 
  Wrench 
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '../../utils/cn'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  return (
    <Card className={cn("text-center py-12 border-none shadow-none bg-transparent", className)}>
      <CardContent className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-muted-foreground mb-4">
          {icon ?? <FolderOpen className="h-8 w-8" />}
        </div>
        <h4 className="text-base font-bold text-foreground mb-1">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {action && (
            <Button variant={action.variant || 'default'} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const EmptyStateNoData: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <EmptyState
    icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
    title="No data found"
    description="There are no items to display at the moment."
    action={onRefresh ? { label: 'Refresh', onClick: onRefresh } : undefined}
  />
)

export const EmptyStateNoResults: React.FC<{ onClearFilters?: () => void }> = ({ onClearFilters }) => (
  <EmptyState
    icon={<SearchCode className="h-8 w-8 text-muted-foreground" />}
    title="No results found"
    description="Try adjusting your search or filters to find what you're looking for."
    action={
      onClearFilters
        ? { label: 'Clear Filters', onClick: onClearFilters, variant: 'outline' }
        : undefined
    }
  />
)

export const EmptyStateNoSelection: React.FC = () => (
  <EmptyState
    icon={<MousePointerClick className="h-8 w-8 text-muted-foreground" />}
    title="Select an item"
    description="Choose an item from the list to view its details."
  />
)

export const EmptyStateError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
    title="Something went wrong"
    description="An error occurred while loading the data. Please try again."
    action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
  />
)

export const EmptyStateNoAccess: React.FC = () => (
  <EmptyState
    icon={<Lock className="h-8 w-8 text-muted-foreground" />}
    title="Access denied"
    description="You don't have permission to view this content."
  />
)

export const EmptyStateComingSoon: React.FC = () => (
  <EmptyState
    icon={<Wrench className="h-8 w-8 text-muted-foreground" />}
    title="Coming soon"
    description="This feature is under development and will be available soon."
  />
)
export default EmptyState
