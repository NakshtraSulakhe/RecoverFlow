import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit, Trash2, Copy, Search, MoreHorizontal } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../../components/ui/table'
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { Switch } from '../../components/ui/switch'
import { Checkbox } from '../../components/ui/checkbox'
import { ScrollArea } from '../../components/ui/scroll-area'
import { roleService, permissionService, type Role, type Permission } from '../../services/api'
import { useApiCall } from '../../hooks/useApiCall'
import { toast } from 'react-toastify'
import { EmptyState } from '../../components/common/EmptyState'

export const RolesPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    code: '',
    description: '',
    is_active: true,
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAllRoles(),
  })

  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAllPermissions(),
  })

  const createRoleMutation = useMutation({
    mutationFn: (data: Partial<Role>) => roleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role created successfully')
      setIsCreateDialogOpen(false)
      resetForm()
    },
    onError: () => toast.error('Failed to create role'),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) => roleService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role updated successfully')
      setIsEditDialogOpen(false)
      resetForm()
    },
    onError: () => toast.error('Failed to update role'),
  })

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role deleted successfully')
    },
    onError: () => toast.error('Failed to delete role'),
  })

  const cloneRoleMutation = useMutation({
    mutationFn: ({ id, name, code }: { id: string; name: string; code: string }) => 
      roleService.cloneRole(id, name, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role cloned successfully')
      setIsCloneDialogOpen(false)
      resetForm()
    },
    onError: () => toast.error('Failed to clone role'),
  })

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', is_active: true })
    setSelectedPermissions([])
    setSelectedRole(null)
  }

  const handleCreateRole = () => {
    const permissions = permissionsData?.data?.filter(p => selectedPermissions.includes(p.id)) || []
    createRoleMutation.mutate({
      ...formData,
      permissions,
    })
  }

  const handleEditRole = () => {
    if (selectedRole) {
      updateRoleMutation.mutate({
        id: selectedRole.id,
        data: {
          ...formData,
        },
      })
    }
  }

  const handleCloneRole = () => {
    if (selectedRole) {
      cloneRoleMutation.mutate({
        id: selectedRole.id,
        name: formData.name || '',
        code: formData.code || '',
      })
    }
  }

  const handleDeleteRole = (role: Role) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteRoleMutation.mutate(role.id)
    }
  }

  const filteredRoles = rolesData?.data?.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const permissionsByModule = (permissionsData?.data || []).reduce((acc, permission) => {
    if (!acc[permission.module_code]) {
      acc[permission.module_code] = []
    }
    acc[permission.module_code].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Roles</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Role</span>
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
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
                <TableHead>Description</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    Loading roles...
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell><code className="bg-muted px-1.5 py-0.5 rounded text-xs">{role.code}</code></TableCell>
                  <TableCell className="text-muted-foreground">{role.description || 'No description'}</TableCell>
                  <TableCell>
                    {role.is_system_role ? (
                      <Badge variant="outline">System</Badge>
                    ) : (
                      <Badge variant="secondary">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.is_active ? 'default' : 'destructive'}>
                      {role.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRole(role)
                            setFormData({
                              name: role.name,
                              code: role.code,
                              description: role.description,
                              is_active: role.is_active,
                            })
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!role.is_system_role && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRole(role)
                              setFormData({
                                name: `${role.name} (Copy)`,
                                code: `${role.code}_copy`,
                              })
                              setIsCloneDialogOpen(true)
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Clone
                          </DropdownMenuItem>
                        )}
                        {!role.is_system_role && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteRole(role)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-96 text-center">
                    <EmptyState
                      title="No roles found"
                      description="Create your first role to get started"
                      action={{
                        label: 'Add Role',
                        onClick: () => setIsCreateDialogOpen(true),
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Recovery Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Role Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., recovery_manager"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the role"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-64">
                    {Object.entries(permissionsByModule).map(([module, perms]) => (
                      <div key={module} className="mb-4 last:mb-0">
                        <h4 className="font-semibold mb-2 capitalize">{module}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {perms.map((perm) => (
                            <div key={perm.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`perm-${perm.id}`}
                                checked={selectedPermissions.includes(perm.id)}
                                onCheckedChange={(checked) => {
                                  setSelectedPermissions(prev =>
                                    checked
                                      ? [...prev, perm.id]
                                      : prev.filter(id => id !== perm.id)
                                  )
                                }}
                              />
                              <Label
                                htmlFor={`perm-${perm.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {perm.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
              {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Role Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clone Role Dialog */}
      <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clone Role</DialogTitle>
            <DialogDescription>
              Create a copy of this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clone-name">New Role Name</Label>
              <Input
                id="clone-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clone-code">New Role Code</Label>
              <Input
                id="clone-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloneDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloneRole} disabled={cloneRoleMutation.isPending}>
              {cloneRoleMutation.isPending ? 'Cloning...' : 'Clone Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RolesPage
