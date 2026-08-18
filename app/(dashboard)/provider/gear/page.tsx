'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PlusSignIcon, Edit02Icon, Delete02Icon, GridViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import { Button } from '@/components/ui/button';
import { deleteGearAction } from '@/app/(dashboard)/_actions/gearActions';
import { useProviderData } from '@/app/(dashboard)/_components/useDashboardData';
import ErrorState from '@/app/(dashboard)/_components/ErrorState';

export default function ProviderGearPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { myGear, gearLoading, isError, refetch } = useProviderData();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGearAction(id),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error ?? 'Could not delete gear');
        return;
      }
      toast.success('Gear removed');
      await queryClient.invalidateQueries({ queryKey: ['gear'] });
    },
    onError: () => toast.error('Could not delete gear'),
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Provider Dashboard · Gear
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">My Gear</h1>
          <p className="mt-1 text-muted-foreground">List, edit, and manage your inventory.</p>
        </div>
        <Button onClick={() => router.push('/provider/gear/new')}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
          Add Gear
        </Button>
      </div>

      {isError ? (
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      ) : (
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">Item</th>
                <th className="px-4 py-3.5 font-semibold">Price / day</th>
                <th className="px-4 py-3.5 font-semibold">Stock</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gearLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : myGear.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={GridViewIcon} className="size-6" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">No gear listed yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Add your first item to start earning from your inventory.
                        </p>
                      </div>
                      <Button size="sm" onClick={() => router.push('/provider/gear/new')}>
                        <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
                        List your first item
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                myGear.map((gear) => (
                  <tr
                    key={gear.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {gear.images?.[0] && (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <GearImage gear={gear} fill sizes="40px" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{gear.name}</p>
                          <p className="text-xs text-muted-foreground">{gear.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold tabular-nums">${gear.pricePerDay.toFixed(2)}</td>
                    <td className="px-4 py-4 tabular-nums">{gear.stockQuantity}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          gear.availability
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${gear.availability ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        {gear.availability ? 'Available' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/provider/gear/${gear.id}/edit`)}
                        >
                          <HugeiconsIcon icon={Edit02Icon} className="size-4" strokeWidth={2} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
                          onClick={() => {
                            if (window.confirm(`Delete "${gear.name}"?`)) deleteMutation.mutate(gear.id);
                          }}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={2} />
                          Delete
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
      )}
    </div>
  );
}