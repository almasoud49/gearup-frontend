'use client';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';

export default function AdminRentalsPage() {
  const { orders, ordersLoading } = useAdminData();

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold sm:text-3xl">All Rentals</h1>
      <p className="mt-1 text-muted-foreground">Every rental order across the platform.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">Loading…</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No rentals yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {order.gearItem?.images?.[0] && (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <GearImage gear={order.gearItem} fill sizes="40px" />
                        </div>
                      )}
                      <span className="font-medium">{order.gearItem?.name ?? 'Gear item'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{order.customer?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {fmt(order.startDate)} → {fmt(order.endDate)}
                  </td>
                  <td className="px-4 py-3 font-semibold">${Number(order.totalPrice).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
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