'use client';

import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';
import ErrorState from '@/app/(dashboard)/_components/ErrorState';
import { HugeiconsIcon } from '@hugeicons/react';
import { CalendarCheckIcon } from '@hugeicons/core-free-icons';
import type { RentalOrder } from '@/lib/types';

export default function AdminOrdersPage() {
  const { orders, ordersLoading, isError, refetch } = useAdminData();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Admin Dashboard · Orders
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Rental Orders</h1>
      <p className="mt-1 text-muted-foreground">Every rental order placed on the platform.</p>

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
                <th className="px-4 py-3.5 font-semibold">Customer</th>
                <th className="px-4 py-3.5 font-semibold">Total</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={CalendarCheckIcon} className="size-6" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">No orders yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Orders placed by customers will appear here.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o: RentalOrder) => (
                  <tr
                    key={o.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4 font-medium">{o.gearItem?.name ?? o.gearItemId}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {o.customer?.name ?? o.customerId}
                    </td>
                    <td className="px-4 py-4 font-semibold tabular-nums">
                      ${Number(o.totalPrice).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={o.status} />
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