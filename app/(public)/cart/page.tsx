'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ShoppingBag01Icon,
  Delete02Icon,
  CreditCardIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import GearImage from '@/app/(public)/_components/gear/GearImage';
import { Button } from '@/components/ui/button';
import { getAllGear } from '@/app/(public)/_actions/gearActions';
import { createRentalAction } from '@/app/(public)/_actions/rentalActions';
import { useCartStore } from '@/lib/cartStore';
import { orderStore } from '@/lib/orderStore';
import { useAuthStore } from '@/lib/auth';
import type { RentalOrder } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { items, remove } = useCartStore();

  const [placing, setPlacing] = useState(false);
  const [orders, setOrders] = useState<RentalOrder[]>([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['gear'],
    queryFn: () => getAllGear({ limit: 100 }),
  });

  const gearById = useMemo(
    () => new Map((data?.data ?? []).map((g) => [g.id, g])),
    [data]
  );

  const enriched = items
    .map((item) => ({ item, gear: gearById.get(item.gearId) }))
    .filter((x): x is { item: (typeof items)[number]; gear: NonNullable<ReturnType<typeof gearById.get>> } => !!x.gear);

  const days = (start: string, end: string) => {
    const s = new Date(`${start}T00:00:00Z`).getTime();
    const e = new Date(`${end}T00:00:00Z`).getTime();
    if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return 0;
    return Math.round((e - s) / 86400000);
  };

  const isValidItem = (item: (typeof items)[number]) =>
    days(item.startDate, item.endDate) >= 1;

  const missingGearIds = items.filter((i) => !gearById.get(i.gearId)).map((i) => i.gearId);

  const total = enriched.reduce(
    (sum, { item, gear }) => sum + gear.pricePerDay * days(item.startDate, item.endDate),
    0
  );

  const formatDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const handlePlaceAll = async () => {
    if (!user) {
      router.push('/login?redirectTo=/cart');
      return;
    }
    const valid = enriched.filter(({ item }) => isValidItem(item));
    if (valid.length === 0) {
      toast.error('Your cart items need valid booking dates.');
      return;
    }
    setPlacing(true);
    const created: RentalOrder[] = [];
    const placedIds = new Set<string>();
    try {
      for (const { item, gear } of valid) {
        const result = await createRentalAction({
          gearItemId: item.gearId,
          startDate: item.startDate,
          endDate: item.endDate,
        });
        if (!result.ok || !result.order) {
          toast.error(`${result.error ?? 'Could not place order'} — ${gear.name}.`);
          continue;
        }
        orderStore.addId(result.order.id);
        created.push(result.order);
        placedIds.add(item.gearId);
      }
    } catch {
      toast.error('Could not place the orders. Please try again.');
    } finally {
      setPlacing(false);
    }

    if (created.length > 0) {
      items.filter((i) => !placedIds.has(i.gearId)).forEach((i) => remove(i.gearId));
      setOrders(created);
      toast.success(
        created.length === 1 ? 'Order placed!' : `${created.length} orders placed!`
      );
      if (created.length < valid.length) {
        toast.error('Some items could not be ordered and were kept in your cart.');
      }
    }
  };

  if (orders.length > 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-500/40 dark:bg-green-500/10">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="mx-auto size-14 text-green-600 dark:text-green-400"
              strokeWidth={2}
            />
            <h1 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-300">
              {orders.length === 1 ? 'Order placed!' : 'All orders placed!'}
            </h1>
            <p className="mt-2 text-green-700 dark:text-green-400">
              Complete payment on each order to confirm your bookings.
            </p>
            <div className="mt-6 space-y-3 text-left">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl bg-card p-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{order.gearItem?.name ?? 'Rental order'}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {order.id.slice(0, 14)}…
                      </p>
                    </div>
                    <span className="font-bold text-primary tabular-nums">
                      ${Number(order.totalPrice).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => router.push(`/payment/${order.id}`)}
                  >
                    <HugeiconsIcon icon={CreditCardIcon} className="size-4" strokeWidth={2} />
                    Pay now
                  </Button>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href="/customer/orders">View my orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="mt-1 text-muted-foreground">Review items before placing your orders.</p>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border/60 bg-card p-10 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="size-6" strokeWidth={2} />
            </span>
            <p className="mt-3 font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add gear you like and rent it all in one go.
            </p>
            <Button asChild className="mt-4">
              <Link href="/gear">Browse gear</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: Math.min(items.length, 3) }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-2xl border border-border/60 bg-card p-10 text-center">
            <p className="font-semibold">Could not load your cart items.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again — nothing has been placed yet.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-3">
              {missingGearIds.map((gearId) => (
                <div
                  key={gearId}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4"
                >
                  <div>
                    <p className="font-semibold text-muted-foreground">Item no longer available</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This gear has been removed from the marketplace.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
                    onClick={() => remove(gearId)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={2} />
                    Remove
                  </Button>
                </div>
              ))}
              {enriched.map(({ item, gear }) => (
                <div
                  key={item.gearId}
                  className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <GearImage gear={gear} fill sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/gear/${gear.id}`}
                      className="line-clamp-1 font-semibold transition-colors hover:text-primary"
                    >
                      {gear.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(item.startDate)} → {formatDate(item.endDate)} ·{' '}
                      {days(item.startDate, item.endDate)} days
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      ${gear.pricePerDay.toFixed(2)}/day
                    </p>
                    {!isValidItem(item) && (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                        Booking dates are invalid — please remove this item.
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold tabular-nums">
                      ${(gear.pricePerDay * days(item.startDate, item.endDate)).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
                    onClick={() => remove(item.gearId)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={2} />
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {enriched.length > 0 && (
              <div className="mt-8 rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {enriched.filter(({ item }) => isValidItem(item)).length} item
                    {enriched.filter(({ item }) => isValidItem(item)).length > 1 ? 's' : ''} ready to
                    rent
                  </span>
                  <span className="text-lg font-bold">
                    Total <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
                  </span>
                </div>
                <Button
                  className="mt-4 w-full py-3 text-base"
                  onClick={handlePlaceAll}
                  disabled={placing || enriched.filter(({ item }) => isValidItem(item)).length === 0}
                >
                  {placing ? 'Placing orders…' : user ? 'Place All Orders' : 'Sign in to Place Orders'}
                  <HugeiconsIcon icon={CreditCardIcon} className="size-4" strokeWidth={2} />
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  One rental order is created per item — you&apos;ll pay for each separately.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}