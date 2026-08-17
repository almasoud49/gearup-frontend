'use client';

import Link from 'next/link';
import {
  GridViewIcon,
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  ArrowRight02Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import StatCard from '@/app/(dashboard)/_components/StatCard';
import Reveal from '@/app/(public)/_components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth';
import { useProviderData } from '@/app/(dashboard)/_components/useDashboardData';

export default function ProviderDashboardOverviewPage() {
  const user = useAuthStore((state) => state.user);
  const { myGear, myOrders, pending, stats, gearLoading, ordersLoading, statsLoading } = useProviderData();

  if (!user) return null;

  const loading = statsLoading || gearLoading || ordersLoading;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Provider Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your inventory and orders.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="My Gear"
          value={loading ? '…' : (stats?.totalGear ?? myGear.length)}
          hint={stats ? `${stats.availableGear} available · ${stats.unavailableGear} unavailable` : undefined}
          icon={<HugeiconsIcon icon={GridViewIcon} className="size-5" strokeWidth={2} />}
        />
        <StatCard
          label="Active Rentals"
          value={loading ? '…' : (stats?.totalOrders ?? myOrders.length)}
          hint={`${stats?.pendingOrders ?? pending} awaiting action`}
          icon={<HugeiconsIcon icon={CalendarCheckIcon} className="size-5" strokeWidth={2} />}
        />
        <StatCard
          label="Pending Orders"
          value={loading ? '…' : (stats?.pendingOrders ?? pending)}
          hint={stats ? `${stats.completedOrders} completed` : undefined}
          icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" strokeWidth={2} />}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <Link
            href="/provider/gear"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={GridViewIcon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">My Gear</h3>
                <p className="text-sm text-muted-foreground">List, edit, and manage your inventory</p>
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
            href="/provider/orders"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={CalendarCheckIcon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">Orders</h3>
                <p className="text-sm text-muted-foreground">Confirm, dispatch, and complete rentals</p>
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

      <div className="mt-8 rounded-2xl border border-dashed border-border/60 bg-card/50 p-8 text-center">
        <h3 className="font-semibold">Want to grow your inventory?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new item to your catalog in a couple of minutes.
        </p>
        <Button asChild className="mt-4">
          <Link href="/provider/gear">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
            Add Gear
          </Link>
        </Button>
      </div>
    </div>
  );
}