import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenants, useDeleteTenant, useSuspendTenant, useActivateTenant, useArchiveTenant } from '../../hooks/useTenants';
import { DataPageLayout, DataPageColumn } from '../../components/common/DataPageLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../../components/ui/table';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Archive,
  Building2,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';

export const Tenants: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, error } = useTenants({ page, limit, search, status });
  const deleteMutation = useDeleteTenant();
  const suspendMutation = useSuspendTenant();
  const activateMutation = useActivateTenant();
  const archiveMutation = useArchiveTenant();

  const columns: DataPageColumn[] = [
    { id: 'tenant_name', label: 'Company Name', align: 'left' },
    { id: 'tenant_code', label: 'Company Code', align: 'left' },
    { id: 'contact_email', label: 'Contact Email', align: 'left' },
    { id: 'subscription_tier', label: 'Subscription', align: 'left' },
    { id: 'is_active', label: 'Status', align: 'center' },
    { id: 'created_at', label: 'Created Date', align: 'left' },
    { id: 'actions', label: 'Actions', align: 'center' },
  ];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Tenant deleted successfully');
      } catch (error) {
        toast.error('Failed to delete tenant');
      }
    }
  };

  const handleSuspend = async (id: string, name: string) => {
    try {
      await suspendMutation.mutateAsync(id);
      toast.success('Tenant suspended successfully');
    } catch (error) {
      toast.error('Failed to suspend tenant');
    }
  };

  const handleActivate = async (id: string, name: string) => {
    try {
      await activateMutation.mutateAsync(id);
      toast.success('Tenant activated successfully');
    } catch (error) {
      toast.error('Failed to activate tenant');
    }
  };

  const handleArchive = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive ${name}?`)) {
      try {
        await archiveMutation.mutateAsync(id);
        toast.success('Tenant archived successfully');
      } catch (error) {
        toast.error('Failed to archive tenant');
      }
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'professional':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'enterprise':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading tenants</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-indigo-500 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tenants = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, total_pages: 0 };

  return (
    <DataPageLayout
      title="Tenants"
      subtitle="Manage all companies and their subscriptions"
      columns={columns}
      primaryAction={{
        label: 'Add Tenant',
        onClick: () => navigate('/platform/tenants/new'),
      }}
      hasData={tenants.length > 0}
      emptyState={{
        icon: <Building2 className="h-12 w-12 text-muted-foreground" />,
        title: 'No tenants found',
        description: 'Get started by adding your first tenant',
        actionLabel: 'Add Tenant',
        onAction: () => navigate('/platform/tenants/new'),
      }}
    >
      {tenants.length > 0 && (
        <Card className={cn('overflow-hidden border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead 
                      key={col.id} 
                      className={cn(
                        col.align === 'right' ? 'text-right' : 
                        col.align === 'center' ? 'text-center' : 'text-left',
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      )}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant: any) => (
                  <TableRow key={tenant.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm',
                          'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                        )}>
                          {tenant.tenant_name?.substring(0, 2).toUpperCase() || 'TN'}
                        </div>
                        <div>
                          <div className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                            {tenant.tenant_name}
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                            {tenant.industry || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn('font-mono text-sm', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                        {tenant.tenant_code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                          {tenant.contact_email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                        getSubscriptionColor(tenant.subscription_tier)
                      )}>
                        {tenant.subscription_tier}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge 
                        status={tenant.is_active ? 'active' : 'inactive'} 
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                          {formatDate(tenant.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/platform/tenants/${tenant.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/platform/tenants/${tenant.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {tenant.is_active ? (
                            <DropdownMenuItem onClick={() => handleSuspend(tenant.id, tenant.tenant_name)}>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivate(tenant.id, tenant.tenant_name)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleArchive(tenant.id, tenant.tenant_name)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(tenant.id, tenant.tenant_name)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, meta.total)} of {meta.total} tenants
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className={cn('px-3 py-1 text-sm rounded-md', isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900')}>
                {page} of {meta.total_pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))}
                disabled={page === meta.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </DataPageLayout>
  );
};

export default Tenants;
