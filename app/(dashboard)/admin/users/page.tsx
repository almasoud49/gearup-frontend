'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowDown01Icon,
  BanIcon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  FilterIcon,
  GridViewIcon,
  Search01Icon,
  UserBlock02Icon,
  UserCircleIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  deleteUserAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from '@/app/(dashboard)/_actions/userActions';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';
import ErrorState from '@/app/(dashboard)/_components/ErrorState';

const ROLES = ['CUSTOMER', 'PROVIDER'] as const;
type RoleFilter = 'ALL' | (typeof ROLES)[number];
type StatusFilter = 'ALL' | 'ACTIVE' | 'SUSPENDED';

const ROLE_BADGE: Record<string, string> = {
  CUSTOMER: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
  PROVIDER: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
};

const ROLE_AVATAR: Record<string, string> = {
  CUSTOMER: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  PROVIDER: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { users, usersLoading, isError, refetch } = useAdminData();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        if (u.role === 'ADMIN') return false;
        const matchesSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'SUSPENDED' ? u.isSuspended : !u.isSuspended);
        return matchesSearch && matchesRole && matchesStatus;
      }),
    [users, search, roleFilter, statusFilter]
  );

  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
  const totalProviders = users.filter((u) => u.role === 'PROVIDER').length;
  const suspendedCount = users.filter((u) => u.isSuspended).length;

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  const suspendMutation = useMutation({
    mutationFn: ({ id, isSuspended }: { id: string; isSuspended: boolean }) =>
      updateUserStatusAction(id, isSuspended),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error ?? 'Backend rejected the update');
        return;
      }
      toast.success('User status updated');
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Backend rejected the update'),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'CUSTOMER' | 'PROVIDER' }) =>
      updateUserRoleAction(id, role),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error ?? 'Backend rejected the update');
        return;
      }
      toast.success('Role updated');
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Backend rejected the update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserAction(id),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error ?? 'Backend rejected the deletion');
        return;
      }
      toast.success('User deleted');
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Backend rejected the deletion'),
  });

  const busy = suspendMutation.isPending || roleMutation.isPending || deleteMutation.isPending;

  const statCards = [
    {
      label: 'Total users',
      value: totalUsers,
      icon: UserMultipleIcon,
      tint: 'bg-primary/10 text-primary',
    },
    {
      label: 'Customers',
      value: totalCustomers,
      icon: UserCircleIcon,
      tint: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      label: 'Providers',
      value: totalProviders,
      icon: GridViewIcon,
      tint: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Suspended',
      value: suspendedCount,
      icon: UserBlock02Icon,
      tint: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Admin Dashboard · Users
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Users</h1>
          <p className="mt-1 text-muted-foreground">View and moderate platform users.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            placeholder="Search by name, email or role…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map(({ label, value, icon, tint }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
          >
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tint}`}>
              <HugeiconsIcon icon={icon} className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-xl font-bold tabular-nums">{usersLoading ? '…' : value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-border/60 bg-card p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <HugeiconsIcon icon={FilterIcon} className="size-3.5" strokeWidth={2} />
            Role
          </span>
          <FilterChip active={roleFilter === 'ALL'} onClick={() => setRoleFilter('ALL')}>
            All
          </FilterChip>
          {ROLES.map((role) => (
            <FilterChip
              key={role}
              active={roleFilter === role}
              onClick={() => setRoleFilter(role)}
            >
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </FilterChip>
          ))}
        </div>
        <div className="hidden h-5 w-px bg-border sm:block" />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          <FilterChip active={statusFilter === 'ALL'} onClick={() => setStatusFilter('ALL')}>
            All
          </FilterChip>
          <FilterChip active={statusFilter === 'ACTIVE'} onClick={() => setStatusFilter('ACTIVE')}>
            Active
          </FilterChip>
          <FilterChip
            active={statusFilter === 'SUSPENDED'}
            onClick={() => setStatusFilter('SUSPENDED')}
          >
            Suspended
          </FilterChip>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-4 py-3.5 font-semibold">Role</th>
                <th className="px-4 py-3.5 font-semibold">Joined</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12">
                    <ErrorState onRetry={refetch} />
                  </td>
                </tr>
              ) : usersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td className="px-5 py-4">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                    </td>
                    <td colSpan={4} className="px-4 py-4">
                      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={UserMultipleIcon} className="size-6" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">No users match your filters</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Try adjusting the search or filter chips.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            ROLE_AVATAR[u.role] ?? 'bg-primary/10 text-primary'
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          {u._count && (
                            <p className="truncate text-xs text-muted-foreground/70">
                              {[
                                u._count.gearItems
                                  ? `${u._count.gearItems} listing${u._count.gearItems === 1 ? '' : 's'}`
                                  : null,
                                u._count.rentalOrders
                                  ? `${u._count.rentalOrders} rental${u._count.rentalOrders === 1 ? '' : 's'}`
                                  : null,
                                u._count.reviews
                                  ? `${u._count.reviews} review${u._count.reviews === 1 ? '' : 's'}`
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          ROLE_BADGE[u.role] ?? 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.isSuspended
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${u.isSuspended ? 'bg-red-500' : 'bg-green-500'}`}
                        />
                        {u.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" aria-haspopup="menu">
                              Actions
                              <HugeiconsIcon
                                icon={ArrowDown01Icon}
                                className="size-3.5"
                                strokeWidth={2}
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={busy}
                              onClick={() =>
                                suspendMutation.mutate({ id: u.id, isSuspended: !u.isSuspended })
                              }
                            >
                              <HugeiconsIcon
                                icon={u.isSuspended ? CheckmarkCircle01Icon : BanIcon}
                                className="size-4"
                                strokeWidth={2}
                              />
                              {u.isSuspended ? 'Activate' : 'Suspend'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={busy}
                              onClick={() =>
                                roleMutation.mutate({
                                  id: u.id,
                                  role: u.role === 'PROVIDER' ? 'CUSTOMER' : 'PROVIDER',
                                })
                              }
                            >
                              <HugeiconsIcon
                                icon={UserMultipleIcon}
                                className="size-4"
                                strokeWidth={2}
                              />
                              Make {u.role === 'PROVIDER' ? 'Customer' : 'Provider'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={busy}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Delete ${u.name}? This also removes their gear and rental history.`
                                  )
                                ) {
                                  deleteMutation.mutate(u.id);
                                }
                              }}
                            >
                              <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={2} />
                              Delete user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
