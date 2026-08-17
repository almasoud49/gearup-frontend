'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CreditCardIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import { Button } from '@/components/ui/button';
import { getRentalById } from '@/app/(public)/_actions/rentalActions';

export default function PayOrderPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['rental', id],
    queryFn: () => getRentalById(id),
    enabled: !!id,
    retry: 0,
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-10 text-center">
        <p className="text-muted-foreground">Could not load this order.</p>
        <Button asChild className="mt-4">
          <Link href="/customer/orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  const canPay = order.status === 'CONFIRMED';

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Pay for your order</h1>
      <p className="mt-1 text-muted-foreground">Review the summary before heading to checkout.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="flex items-center gap-4 border-b border-border/60 p-5">
          {order.gearItem?.images?.[0] && (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <GearImage gear={order.gearItem} fill sizes="64px" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{order.gearItem?.name ?? 'Gear item'}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {new Date(order.startDate).toLocaleDateString()} → {new Date(order.endDate).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-3 p-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rental total</span>
            <span className="font-semibold">${Number(order.totalPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{order.id}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {canPay ? (
          <Button asChild size="lg" className="w-full">
            <Link href={`/payment/${order.id}`}>
              <HugeiconsIcon icon={CreditCardIcon} className="size-4" strokeWidth={2} />
              Continue to secure checkout
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
            </Link>
          </Button>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
            <p className="text-muted-foreground">
              This order is not ready to pay (current status: {order.status}). Confirmations and
              payment links appear once the provider confirms it.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/customer/orders">Back to My Orders</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}