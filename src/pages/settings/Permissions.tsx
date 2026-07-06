import React, { useState } from 'react'
import { Search, Shield, Lock, Eye, Edit, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { permissionService, type Permission } from '../../services/api'
import { EmptyState } from '../../components/common/EmptyState'

export const PermissionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAllPermissions(),
  })

  const filteredPermissions = permissionsData?.data?.filter(perm =>
    perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    perm.permission_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    perm.module_code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const getPermissionTypeColor = (type: string) => {
    switch (type) {
      case 'module':
        return 'bg-purple-500'
      case 'page':
        return 'bg-blue-500'
      case 'action':
        return 'bg-green-500'
      case 'feature':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Permissions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View all available permissions in the system
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border border-border bg-card shadow-sm">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    Loading permissions...
                  </TableCell>
                </TableRow>
              ) : filteredPermissions.length > 0 ? (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      {permission.name}
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                        {permission.permission_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {permission.module_code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getPermissionTypeColor(permission.permission_type)} text-white`}
                      >
                        {permission.permission_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {permission.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.is_active ? 'default' : 'destructive'}>
                        {permission.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-96 text-center">
                    <EmptyState
                      icon={<Lock className="h-12 w-12" />}
                      title="No permissions found"
                      description="No permissions available in the system"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default PermissionsPage
