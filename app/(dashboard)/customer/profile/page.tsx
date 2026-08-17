'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfileAction } from '@/app/(dashboard)/_actions/userActions';
import { useAuthStore } from '@/lib/auth';
import { getMe } from '@/service/getMe';
import type { User } from '@/lib/types';

export default function CustomerProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [state, dispatch, isPending] = useActionState(updateProfileAction, {
    success: false,
  });

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success('Profile updated!');
      getMe()
        .then((result) => {
          const profile = result?.success ? (result.data?.profile as User | undefined) ?? null : null;
          setUser(profile);
        })
        .catch(() => undefined);
    } else if (state.form) {
      toast.error(state.form);
    }
  }, [state, setUser]);

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
      : '—';

  if (!user) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
        <p className="text-muted-foreground">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
      <p className="mt-1 text-muted-foreground">Your account details and role on GearUp.</p>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-lg font-semibold">{user.name}</p>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {user.role}
              </span>
            </div>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Member since</dt>
            <dd className="mt-1 font-medium">{fmt(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Account status</dt>
            <dd className="mt-1">
              {user.isSuspended ? (
                <span className="font-medium text-red-600 dark:text-red-400">Suspended</span>
              ) : (
                <span className="font-medium text-green-600 dark:text-green-400">Active</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Last updated</dt>
            <dd className="mt-1 font-medium">{fmt(user.updatedAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Edit details</h2>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              aria-invalid={state?.field === 'name'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              aria-invalid={state?.field === 'email'}
            />
          </div>
          {state?.form && (
            <p className="text-sm text-red-600 dark:text-red-400">{state.form}</p>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}