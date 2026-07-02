import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubscriptions, useUpgradeSubscription, useSuspendSubscription, useActivateSubscription, useCancelSubscription, useRenewSubscription } from '../../hooks/useSubscriptions';
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
  TrendingUp, 
  Ban, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  CreditCard,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';

export const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');

  const { data, isLoading, error } = useSubscriptions({ page, limit, status });
  const upgradeMutation = useUpgradeSubscription();
  const suspendMutation = useSuspendSubscription();
  const activateMutation = useActivateSubscription();
  const cancelMutation = useCancelSubscription();
  const renewMutation = useRenewSubscription();

  const columns: DataPageColumn[] = [
    { id: 'subscription_code', label: 'Subscription Code', align: 'left' },
    { id: 'tenant_name', label: 'Tenant', align: 'left' },
    { id: 'plan_name', label: 'Plan', align: 'left' },
    { id: 'billing_cycle', label: 'Billing Cycle', align: 'left' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'end_date', label: 'End Date', align: 'left' },
    { id: 'actions', label: 'Actions', align: 'center' },
  ];

  const handleUpgrade = async (id: string) => {
    const planCode = prompt('Enter the new plan code:');
    if (!planCode) return;
    
    const planName = prompt('Enter the new plan name:');
    if (!planName) return;
    
    const amountStr = prompt('Enter the new amount:');
    if (!amountStr) return;
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      toast.error('Invalid amount');
      return;
    }
    
    try {
      await upgradeMutation.mutateAsync({ id, plan_code: planCode, plan_name: planName, amount });
      toast.success('Subscription upgraded successfully');
    } catch (error) {
      toast.error('Failed to upgrade subscription');
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendMutation.mutateAsync(id);
      toast.success('Subscription suspended successfully');
    } catch (error) {
      toast.error('Failed to suspend subscription');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateMutation.mutateAsync(id);
      toast.success('Subscription activated successfully');
    } catch (error) {
      toast.error('Failed to activate subscription');
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await cancelMutation.mutateAsync(id);
        toast.success('Subscription cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const handleRenew = async (id: string) => {
    try {
      await renewMutation.mutateAsync(id);
      toast.success('Subscription renewed successfully');
    } catch (error) {
      toast.error('Failed to renew subscription');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'suspended':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'expired':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPlanColor = (planCode: string) => {
    switch (planCode) {
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
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
          <p className="text-red-500 mb-2">Error loading subscriptions</p>
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

  const subscriptions = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, total_pages: 0 };

  return (
    <DataPageLayout
      title="Subscriptions"
      subtitle="Manage all tenant subscriptions and plans"
      columns={columns}
      primaryAction={{
        label: 'Create Subscription',
        onClick: () => navigate('/platform/subscriptions/new'),
      }}
      hasData={subscriptions.length > 0}
      emptyState={{
        icon: <CreditCard className="h-12 w-12 text-muted-foreground" />,
        title: 'No subscriptions found',
        description: 'Get started by creating your first subscription',
        actionLabel: 'Create Subscription',
        onAction: () => navigate('/platform/subscriptions/new'),
      }}
    >
      {subscriptions.length > 0 && (
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
                {subscriptions.map((subscription: any) => (
                  <TableRow key={subscription.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <TableCell>
                      <span className={cn('font-mono text-sm', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                        {subscription.subscription_code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs',
                          'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                        )}>
                          {subscription.tenant_name?.substring(0, 2).toUpperCase() || 'TN'}
                        </div>
                        <div>
                          <div className={cn('font-medium text-sm', isDark ? 'text-white' : 'text-zinc-900')}>
                            {subscription.tenant_name}
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                            {subscription.tenant_code}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                        getPlanColor(subscription.plan_code)
                      )}>
                        {subscription.plan_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn('text-sm capitalize', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                        {subscription.billing_cycle}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="h-4 w-4 text-zinc-400" />
                        <span className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                          {formatCurrency(subscription.amount, subscription.currency)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                        getStatusColor(subscription.status)
                      )}>
                        {subscription.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                          {formatDate(subscription.end_date)}
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
                          <DropdownMenuItem onClick={() => navigate(`/platform/subscriptions/${subscription.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpgrade(subscription.id)}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Upgrade Plan
                          </DropdownMenuItem>
                          {subscription.status === 'active' ? (
                            <>
                              <DropdownMenuItem onClick={() => handleSuspend(subscription.id)}>
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancel(subscription.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => handleActivate(subscription.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRenew(subscription.id)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Renew
                              </DropdownMenuItem>
                            </>
                          )}
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
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, meta.total)} of {meta.total} subscriptions
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

export default Subscriptions;
