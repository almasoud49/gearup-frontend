'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CalendarCheckIcon,
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
import ErrorState from '@/app/(dashboard)/_components/ErrorState';
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
    <tr className="border-t border-border/40 transition-colors last:border-0 hover:bg-muted/40">
      <td className="px-5 py-4">
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
      <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
        {new Date(order.startDate).toLocaleDateString()}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
        {new Date(order.endDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 font-semibold tabular-nums">${Number(order.totalPrice).toFixed(2)}</td>
      <td className="px-4 py-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-5 py-4 text-right">
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
  const { myOrders, ordersLoading, isError, refetch } = useProviderData();

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
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Provider Dashboard · Orders
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Orders</h1>
      <p className="mt-1 text-muted-foreground">Confirm, dispatch, and complete rentals.</p>

      {isError ? (
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">Item / Customer</th>
                <th className="px-4 py-3.5 font-semibold">Start</th>
                <th className="px-4 py-3.5 font-semibold">End</th>
                <th className="px-4 py-3.5 font-semibold">Total</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : myOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={CalendarCheckIcon} className="size-6" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">No orders yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          New rental orders will show up here for you to confirm.
                        </p>
                      </div>
                    </div>
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
      )}
    </div>
  );
}