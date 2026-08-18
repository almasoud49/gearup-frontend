'use client';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';
import ErrorState from '@/app/(dashboard)/_components/ErrorState';
import { HugeiconsIcon } from '@hugeicons/react';
import { GridViewIcon } from '@hugeicons/core-free-icons';

export default function AdminGearPage() {
  const { gear, gearLoading, isError, refetch } = useAdminData();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Admin Dashboard · Gear
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Gear Listings</h1>
      <p className="mt-1 text-muted-foreground">Every item available across the platform.</p>

      {isError ? (
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      ) : (
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">Item</th>
                <th className="px-4 py-3.5 font-semibold">Provider</th>
                <th className="px-4 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {gearLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : gear.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={GridViewIcon} className="size-6" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">No gear listed</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Gear items from providers will appear here.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                gear.map((g) => (
                  <tr
                    key={g.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {g.images?.[0] && (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <GearImage gear={g} fill sizes="40px" />
                          </div>
                        )}
                        <span className="font-medium">{g.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{g.provider?.name ?? '—'}</td>
                    <td className="px-4 py-4 font-semibold tabular-nums">${g.pricePerDay.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          g.availability
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${g.availability ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        {g.availability ? 'Active' : 'Inactive'}
                      </span>
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