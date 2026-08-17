'use client';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';

export default function AdminGearPage() {
  const { gear, gearLoading } = useAdminData();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Gear Listings</h1>
      <p className="mt-1 text-muted-foreground">Every item available across the platform.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {gearLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">Loading…</td>
              </tr>
            ) : gear.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No gear.
                </td>
              </tr>
            ) : (
              gear.map((g) => (
                <tr key={g.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {g.images?.[0] && (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <GearImage gear={g} fill sizes="40px" />
                        </div>
                      )}
                      <span className="font-medium">{g.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{g.provider?.name ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold">${g.pricePerDay.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        g.availability
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground'
                      }`}
                    >
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
  );
}