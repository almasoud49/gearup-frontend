'use client';

import { Suspense, useMemo, useState } from 'react';
import GearImage from '@/app/(public)/_components/gear/GearImage';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckmarkCircle02Icon, CreditCardIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import { Button } from '@/components/ui/button';
import { getGearById } from '@/app/(public)/_actions/gearActions';
import { createRentalAction } from '@/app/(public)/_actions/rentalActions';
import { orderStore } from '@/lib/orderStore';
import type { RentalOrder } from '@/lib/types';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gearId = searchParams.get('gearId') ?? '';
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';

  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<RentalOrder | null>(null);

  const { data: gearData } = useQuery({
    queryKey: ['gear', gearId],
    queryFn: () => getGearById(gearId),
    enabled: !!gearId,
  });

  const gear = gearData?.data;

  const days = useMemo(() => {
    if (!startDate || !endDate || endDate <= startDate) return 0;
    return Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000);
  }, [startDate, endDate]);

  const total = gear ? gear.pricePerDay * days : 0;

  const handlePlaceOrder = async () => {
    if (!gear || days < 1) return;
    setPlacing(true);
    try {
      const result = await createRentalAction({
        gearItemId: gear.id,
        startDate,
        endDate,
      });
      if (!result.ok || !result.order) {
        toast.error(result.error ?? 'Could not place the order. Please try again.');
        return;
      }
      orderStore.addId(result.order.id);
      setOrder(result.order);
      toast.success('Rental order placed!');
    } catch {
      toast.error('Could not place the order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-500/40 dark:bg-green-500/10">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mx-auto size-14 text-green-600 dark:text-green-400" strokeWidth={2} />
          <h1 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-300">Order placed!</h1>
          <p className="mt-2 text-green-700 dark:text-green-400">
            Your rental order is ready. Complete payment to confirm your booking.
          </p>
          <div className="mt-6 rounded-xl bg-card p-5 text-left text-sm">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono">{order.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">{order.status}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{days} days</span>
            </div>
            <div className="flex justify-between border-t border-green-100 py-1 pt-2 dark:border-green-500/20">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">${Number(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="mt-6 w-full py-3 text-base"
            onClick={() => router.push(`/payment/${order.id}`)}
          >
            <HugeiconsIcon icon={CreditCardIcon} className="size-4" strokeWidth={2} />
            Proceed to Payment
          </Button>
          <p className="mt-3 text-xs text-green-600/80 dark:text-green-400/80">
            Secure payment powered by Stripe — wired in the next step.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-muted-foreground">Review your rental before placing the order.</p>

      {gear ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card">
          <div className="flex gap-4 p-5">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
              <GearImage gear={gear} fill sizes="96px" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {gear.category?.name}
              </p>
              <h2 className="truncate font-semibold">{gear.name}</h2>
              <p className="text-sm text-muted-foreground">
                ${gear.pricePerDay.toFixed(2)} / day
              </p>
            </div>
          </div>

          <div className="border-t border-border/60 p-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Start</p>
                <p className="mt-1 font-semibold">{formatDate(startDate)}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">End</p>
                <p className="mt-1 font-semibold">
                  {new Date(`${endDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ${gear.pricePerDay.toFixed(2)} × {days}
                </span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 font-semibold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 p-5">
            <Button className="w-full py-3 text-base" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Placing order…' : 'Place Order'}
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-10 text-center">
          <div className="mx-auto h-8 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto mt-3 h-40 max-w-sm animate-pulse rounded-2xl bg-muted" />
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/gear" className="text-primary hover:underline">
          ← Continue browsing
        </Link>
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense>{<CheckoutContent />}</Suspense>
    </div>
  );
}