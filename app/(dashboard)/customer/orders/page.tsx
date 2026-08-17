'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreditCardIcon, StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import ReviewModal from '@/app/(dashboard)/_components/reviews/ReviewModal';
import { Button } from '@/components/ui/button';
import { useCustomerData } from '@/app/(dashboard)/_components/useDashboardData';
import type { RentalOrder } from '@/lib/types';

function OrderCard({
  order,
  onPay,
  onReview,
}: {
  order: RentalOrder;
  onPay?: (order: RentalOrder) => void;
  onReview?: (order: RentalOrder) => void;
}) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const gear = order.gearItem;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center">
      {gear?.images?.[0] && (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
          <GearImage gear={gear} fill sizes="64px" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{gear?.name ?? 'Gear item'}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {fmt(order.startDate)} → {fmt(order.endDate)}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-lg font-bold">${Number(order.totalPrice).toFixed(2)}</p>
        <p className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 10)}…</p>
      </div>
      <div className="flex justify-end">
        {order.status === 'CONFIRMED' && onPay && (
          <Button size="sm" onClick={() => onPay(order)}>
            <HugeiconsIcon icon={CreditCardIcon} className="size-4" strokeWidth={2} />
            Pay Now
          </Button>
        )}
        {order.status === 'RETURNED' && !order.review && onReview && (
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm hover:from-amber-500 hover:to-orange-600"
            onClick={() => onReview(order)}
          >
            <HugeiconsIcon icon={StarIcon} className="size-4" strokeWidth={2} />
            Leave Review
          </Button>
        )}
        {order.status === 'PAID' && order.gearItem && (
          <Button asChild size="sm" variant="ghost">
            <Link href={`/gear/${order.gearItemId}`}>View gear</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { orders, isLoading } = useCustomerData();

  const [showHistory, setShowHistory] = useState(false);
  const [reviewFor, setReviewFor] = useState<RentalOrder | null>(null);

  const openReview = (order: RentalOrder) => {
    setReviewFor(order);
  };

  const filteredOrders = orders.filter((o) =>
    showHistory ? true : ['PLACED', 'CONFIRMED', 'PAID', 'PICKED_UP'].includes(o.status)
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
          <p className="mt-1 text-muted-foreground">Track, pay, and review your rentals.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowHistory((v) => !v)}>
          {showHistory ? 'Active only' : 'Show all'}
        </Button>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-10 text-center">
          <p className="text-muted-foreground">No rentals yet.</p>
          <Button asChild className="mt-4">
            <Link href="/gear">Browse gear</Link>
          </Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-10 text-center">
          <p className="text-muted-foreground">No active rentals.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPay={(o) => router.push(`/payment/${o.id}`)}
              onReview={openReview}
            />
          ))}
        </div>
      )}

      {reviewFor && (
        <ReviewModal
          key={reviewFor.id}
          order={reviewFor}
          onClose={() => setReviewFor(null)}
        />
      )}
    </div>
  );
}