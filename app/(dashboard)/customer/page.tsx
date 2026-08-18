'use client';

import Link from 'next/link';
import {
  CalendarCheckIcon,
  Wallet01Icon,
  CreditCardIcon,
  StarIcon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import StatCard from '@/app/(dashboard)/_components/StatCard';
import Reveal from '@/app/(public)/_components/motion/Reveal';
import ReviewModal from '@/app/(dashboard)/_components/reviews/ReviewModal';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth';
import { useCustomerData } from '@/app/(dashboard)/_components/useDashboardData';
import { useState } from 'react';
import type { RentalOrder } from '@/lib/types';

export default function CustomerDashboardOverviewPage() {
  const user = useAuthStore((state) => state.user);
  const { orders, payments, totalSpent, activeOrders, pendingReviews, stats, statsLoading } =
    useCustomerData();

  const [reviewFor, setReviewFor] = useState<RentalOrder | null>(null);

  const totalOrders = stats?.total ?? orders.length;
  const activeCount = stats
    ? stats.placed + stats.confirmed + stats.paid + stats.pickedUp
    : activeOrders;

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Customer Dashboard · Overview
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome, {user.name.split(' ')[0]} 👋</h1>
      <p className="mt-1 text-muted-foreground">Here&apos;s what&apos;s happening with your rentals.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Orders"
          value={statsLoading && stats === undefined ? '…' : totalOrders}
          hint={`${statsLoading ? '…' : activeCount} active`}
          icon={<HugeiconsIcon icon={CalendarCheckIcon} className="size-5" strokeWidth={2} />}
        />
        <StatCard
          label="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          hint={`${payments.length} payment${payments.length === 1 ? '' : 's'}`}
          icon={<HugeiconsIcon icon={Wallet01Icon} className="size-5" strokeWidth={2} />}
        />
        <StatCard
          label="Payments"
          value={payments.length}
          icon={<HugeiconsIcon icon={CreditCardIcon} className="size-5" strokeWidth={2} />}
        />
      </div>

      {pendingReviews.length > 0 && (
        <Reveal>
          <div className="relative isolate mt-6 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-50 via-orange-50 to-fuchsia-50 p-5 sm:flex-row sm:items-center dark:from-amber-500/10 dark:via-orange-500/10 dark:to-fuchsia-500/10">
            <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                <HugeiconsIcon icon={StarIcon} className="size-5" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">
                  {pendingReviews.length} rental{pendingReviews.length > 1 ? 's' : ''} waiting for your review
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tell other renters how the gear performed — it only takes a minute.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:from-amber-500 hover:to-orange-600"
              onClick={() => {
                const first = pendingReviews[0];
                setReviewFor(first);
              }}
            >
              <HugeiconsIcon icon={StarIcon} className="size-4" strokeWidth={2} />
              Leave a review
            </Button>
          </div>
        </Reveal>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <Link
            href="/customer/orders"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={CalendarCheckIcon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-muted-foreground">Track, pay, and review your rentals</p>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              strokeWidth={2}
            />
          </Link>
        </Reveal>
        <Reveal delay={100}>
          <Link
            href="/customer/payments"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={Wallet01Icon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">Payment History</h3>
                <p className="text-sm text-muted-foreground">Review all your past transactions</p>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              strokeWidth={2}
            />
          </Link>
        </Reveal>
      </div>

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