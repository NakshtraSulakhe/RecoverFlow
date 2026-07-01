import React from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  path?: string
  icon?: React.ReactNode
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  maxItems?: number
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/dashboard' },
    ]

    let currentPath = ''
    pathSegments.forEach((segment) => {
      if (segment === 'dashboard') return
      currentPath += `/${segment}`
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        path: currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  return (
    <nav className="flex text-sm font-semibold select-none animate-fade-in" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-1.5">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && <ChevronRight className="mx-1 h-3.5 w-3.5 text-muted-foreground/60" />}
              {isLast ? (
                <span className="text-foreground flex items-center font-bold">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <RouterLink
                  to={item.path || '#'}
                  className="text-muted-foreground hover:text-foreground flex items-center transition-colors duration-150"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </RouterLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
export default Breadcrumbs
