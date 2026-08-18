'use client';

import Link from 'next/link';
import {
  UserMultipleIcon,
  GridViewIcon,
  CalendarCheckIcon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import StatCard from '@/app/(dashboard)/_components/StatCard';
import Reveal from '@/app/(public)/_components/motion/Reveal';
import { useAdminData } from '@/app/(dashboard)/_components/useDashboardData';

export default function AdminDashboardOverviewPage() {
  const { stats, usersLoading, gearLoading, ordersLoading, statsLoading } = useAdminData();

  const loading = statsLoading || usersLoading || gearLoading || ordersLoading;

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Admin Dashboard · Overview
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Platform overview and moderation tools.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Users"
          value={loading ? '…' : (stats?.totalUsers ?? 0)}
          hint={stats ? `${stats.totalCustomers} customers · ${stats.totalProviders} providers` : undefined}
          icon={<HugeiconsIcon icon={UserMultipleIcon} className="size-5" strokeWidth={2} />}
        />
        <StatCard
          label="Active Gear"
          value={loading ? '…' : (stats?.totalGear ?? 0)}
          hint={stats ? `${stats.totalGear} total listings` : undefined}
          icon={<HugeiconsIcon icon={GridViewIcon} className="size-5" strokeWidth={2} />}
        />
        <StatCard
          label="Total Rentals"
          value={loading ? '…' : (stats?.totalRentals ?? 0)}
          hint={stats ? `$${Number(stats.totalRevenue).toLocaleString()} revenue` : undefined}
          icon={<HugeiconsIcon icon={CalendarCheckIcon} className="size-5" strokeWidth={2} />}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Reveal>
          <Link
            href="/admin/users"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={UserMultipleIcon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">Users</h3>
                <p className="text-sm text-muted-foreground">Search and moderate accounts</p>
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
            href="/admin/gear"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={GridViewIcon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">Gear</h3>
                <p className="text-sm text-muted-foreground">Browse all listings</p>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              strokeWidth={2}
            />
          </Link>
        </Reveal>
        <Reveal delay={200}>
          <Link
            href="/admin/orders"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={CalendarCheckIcon} className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold">Orders</h3>
                <p className="text-sm text-muted-foreground">Review all rental orders</p>
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
    </div>
  );
}