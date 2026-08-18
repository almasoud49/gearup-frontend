'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeartIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearCard from '@/app/(public)/_components/gear/GearCard';
import { Button } from '@/components/ui/button';
import { getAllGear } from '@/app/(public)/_actions/gearActions';
import ErrorState from '@/app/(dashboard)/_components/ErrorState';
import { useWishlistStore } from '@/lib/wishlistStore';

export default function CustomerWishlistPage() {
  const ids = useWishlistStore((s) => s.ids);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['gear'],
    queryFn: () => getAllGear({ limit: 100 }),
  });

  const wishlisted = useMemo(
    () => (data?.data ?? []).filter((g) => ids.includes(g.id)),
    [data, ids]
  );

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Customer Dashboard · Wishlist
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">My Wishlist</h1>
      <p className="mt-1 text-muted-foreground">Gear you&apos;ve saved to rent later.</p>

      {isError ? (
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      ) : isLoading && ids.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: Math.min(ids.length, 6) }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : wishlisted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={HeartIcon} className="size-6" strokeWidth={2} />
          </span>
          <p className="mt-3 font-semibold">No saved gear yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any gear to save it here for later.
          </p>
          <Button asChild className="mt-4">
            <Link href="/gear">Browse gear</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlisted.map((g) => (
            <GearCard key={g.id} gear={g} />
          ))}
        </div>
      )}
    </div>
  );
}