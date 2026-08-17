'use client';

import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';
import type { RentalOrder } from '@/lib/types';

export default function AdminOrdersPage() {
  const { orders, ordersLoading } = useAdminData();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Rental Orders</h1>
      <p className="mt-1 text-muted-foreground">Every rental order placed on the platform.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">Loading…</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No orders.
                </td>
              </tr>
            ) : (
              orders.map((o: RentalOrder) => (
                <tr key={o.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-medium">{o.gearItem?.name ?? o.gearItemId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.customer?.name ?? o.customerId}</td>
                  <td className="px-4 py-3 font-semibold">${Number(o.totalPrice).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
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