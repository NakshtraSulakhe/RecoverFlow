import React from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/table'

export interface DataPageColumn {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export interface DataPageLayoutProps {
  title: string
  subtitle?: string
  columns: DataPageColumn[]
  primaryAction?: { label: string; onClick?: () => void }
  emptyState?: {
    icon?: React.ReactNode
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
  }
  hasData?: boolean
  toolbar?: React.ReactNode
  children?: React.ReactNode
}

export const DataPageLayout: React.FC<DataPageLayoutProps> = ({
  title,
  subtitle,
  columns,
  primaryAction,
  emptyState,
  hasData = false,
  toolbar,
  children,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {primaryAction && (
          <Button 
            variant="default"
            className="flex items-center gap-1.5"
            onClick={primaryAction.onClick}
          >
            <Plus className="h-4.5 w-4.5" />
            <span>{primaryAction.label}</span>
          </Button>
        )}
      </div>

      {/* Toolbar Options (Filters / Search) */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search records..." 
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
        {toolbar && (
          <div className="border-t border-border p-4 bg-muted/20">
            {toolbar}
          </div>
        )}
      </Card>

      {/* Main Table Content */}
      {hasData && children ? (
        children
      ) : (
        <Card className="overflow-hidden border border-border bg-card shadow-sm">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead 
                      key={col.id} 
                      className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-96 text-center">
                    <EmptyState
                      icon={emptyState?.icon}
                      title={emptyState?.title ?? 'No records found'}
                      description={emptyState?.description}
                      action={
                        emptyState?.actionLabel
                          ? {
                              label: emptyState.actionLabel,
                              onClick: emptyState.onAction ?? (() => {}),
                              variant: 'outline'
                            }
                          : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}
export default DataPageLayout
