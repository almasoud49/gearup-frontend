'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { BanIcon, CheckmarkCircle01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUserStatusAction } from '@/app/(dashboard)/_actions/userActions';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { users, usersLoading } = useAdminData();
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Users</h1>
          <p className="mt-1 text-muted-foreground">View and moderate platform users.</p>
        </div>
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-2.5 size-4 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            placeholder="Search users…"
            className="w-56 pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {usersLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">Loading…</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.isSuspended
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                      }`}
                    >
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant={u.isSuspended ? 'outline' : 'destructive'}
                        disabled={suspendMutation.isPending}
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
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}