'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CheckmarkCircle02Icon,
  TruckIcon,
  Home03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import { Button } from '@/components/ui/button';
import { updateRentalStatusAction } from '@/app/(dashboard)/_actions/rentalActions';
import { useProviderData } from '@/app/(dashboard)/_components/useDashboardData';
import type { RentalOrder, RentalStatus } from '@/lib/types';

function OrderRow({
  order,
  onMutate,
}: {
  order: RentalOrder;
  onMutate: (status: RentalStatus) => void;
}) {
  const gear = order.gearItem;
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {gear?.images?.[0] && (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              <GearImage gear={gear} fill sizes="40px" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{gear?.name ?? order.gearItemId}</p>
            <p className="text-xs text-muted-foreground">
              {order.customer?.name ?? order.customerId.slice(0, 10)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(order.startDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(order.endDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 font-semibold">${Number(order.totalPrice).toFixed(2)}</td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3 text-right">
        {order.status === 'PLACED' && (
          <Button size="sm" onClick={() => onMutate('CONFIRMED')}>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" strokeWidth={2} />
            Confirm
          </Button>
        )}
        {order.status === 'PAID' && (
          <Button size="sm" onClick={() => onMutate('PICKED_UP')}>
            <HugeiconsIcon icon={TruckIcon} className="size-4" strokeWidth={2} />
            Mark Picked Up
          </Button>
        )}
        {order.status === 'PICKED_UP' && (
          <Button size="sm" variant="outline" onClick={() => onMutate('RETURNED')}>
            <HugeiconsIcon icon={Home03Icon} className="size-4" strokeWidth={2} />
            Mark Returned
          </Button>
        )}
      </td>
    </tr>
  );
}

export default function ProviderOrdersPage() {
  const queryClient = useQueryClient();
  const { myOrders, ordersLoading } = useProviderData();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      updateRentalStatusAction(id, status),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error ?? 'Backend rejected the status change.');
        return;
      }
      toast.success('Order updated!');
      await queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
    onError: () => toast.error('Backend rejected the status change.'),
  });

  const handleMutate = (order: RentalOrder, status: RentalStatus) => {
    statusMutation.mutate({ id: order.id, status });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>
      <p className="mt-1 text-muted-foreground">Confirm, dispatch, and complete rentals.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Item / Customer</th>
              <th className="px-4 py-3 font-medium">Start</th>
              <th className="px-4 py-3 font-medium">End</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {ordersLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">Loading…</td>
              </tr>
            ) : myOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              myOrders.map((order) => (
                <OrderRow key={order.id} order={order} onMutate={(s) => handleMutate(order, s)} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}