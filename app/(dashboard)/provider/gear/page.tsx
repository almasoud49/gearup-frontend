'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PlusSignIcon, Edit02Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import { Button } from '@/components/ui/button';
import { deleteGearAction } from '@/app/(dashboard)/_actions/gearActions';
import { useProviderData } from '@/app/(dashboard)/_components/useDashboardData';

export default function ProviderGearPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { myGear, gearLoading } = useProviderData();

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
          <h1 className="text-2xl font-bold sm:text-3xl">My Gear</h1>
          <p className="mt-1 text-muted-foreground">List, edit, and manage your inventory.</p>
        </div>
        <Button onClick={() => router.push('/provider/gear/new')}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
          Add Gear
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Price / day</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gearLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">Loading…</td>
              </tr>
            ) : myGear.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  You haven&apos;t listed any gear yet.
                  <div className="mt-3">
                    <Button size="sm" onClick={() => router.push('/provider/gear/new')}>
                      List your first item
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              myGear.map((gear) => (
                <tr key={gear.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 font-semibold">${gear.pricePerDay.toFixed(2)}</td>
                  <td className="px-4 py-3">{gear.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        gear.availability
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                      }`}
                    >
                      {gear.availability ? 'Available' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
  );
}