'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  Calendar02Icon,
  ArrowRight02Icon,
  BadgeCheckIcon,
  ShoppingBag01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import GearCard from '@/app/(public)/_components/gear/GearCard';
import GearImage, { isRenderedImage } from '@/app/(public)/_components/gear/GearImage';
import WishlistButton from '@/app/(public)/_components/gear/WishlistButton';
import { Button } from '@/components/ui/button';
import { getAllGear, getGearById } from '@/app/(public)/_actions/gearActions';
import { getMyRentals } from '@/app/(public)/_actions/rentalActions';
import { useAuthStore } from '@/lib/auth';
import { useCartStore } from '@/lib/cartStore';
import { RatingStars } from '@/app/(public)/_components/gear/RatingStars';
import { cn } from '@/lib/utils';

export default function GearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['gear', id],
    queryFn: () => getGearById(id),
    enabled: !!id,
  });

  const gear = data?.data;

  const galleryImages = (gear?.images ?? []).filter(isRenderedImage).slice(0, 4);
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);

  const { data: relatedData } = useQuery({
    queryKey: ['gear', 'related', gear?.categoryId],
    queryFn: () => getAllGear({ limit: 50 }),
    enabled: !!gear,
  });
  const related = (relatedData?.data ?? [])
    .filter((g) => g.id !== gear?.id && (gear ? g.categoryId === gear.categoryId : false))
    .slice(0, 4);

  const today = (() => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  })();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isCustomer = user?.role === 'CUSTOMER';
  const { data: myRentalsData } = useQuery({
    queryKey: ['my-rentals', 'booking', gear?.id],
    queryFn: getMyRentals,
    enabled: !!gear && !!user && isCustomer,
  });

  const blockedRanges = useMemo(() => {
    if (!gear) return [] as { start: string; end: string }[];
    return (myRentalsData?.data ?? [])
      .filter(
        (r) =>
          r.gearItemId === gear.id &&
          ['PLACED', 'CONFIRMED', 'PAID', 'PICKED_UP'].includes(r.status)
      )
      .map((r) => ({
        start: new Date(r.startDate).toISOString().split('T')[0],
        end: new Date(r.endDate).toISOString().split('T')[0],
      }))
      .filter((r) => !Number.isNaN(new Date(r.start).getTime()) && !Number.isNaN(new Date(r.end).getTime()));
  }, [gear, myRentalsData]);

  const bookingConflict = useMemo(() => {
    if (!startDate || !endDate) return null;
    const range = {
      start: new Date(`${startDate}T00:00:00`).getTime(),
      end: new Date(`${endDate}T00:00:00`).getTime(),
    };
    const hit = blockedRanges.find(
      (b) =>
        range.start <= new Date(`${b.end}T00:00:00`).getTime() &&
        range.end >= new Date(`${b.start}T00:00:00`).getTime()
    );
    if (!hit) return null;
    return `You already have this gear booked ${new Date(`${hit.start}T00:00:00`).toLocaleDateString()} → ${new Date(`${hit.end}T00:00:00`).toLocaleDateString()}.`;
  }, [startDate, endDate, blockedRanges]);

  const days = useMemo(() => {
    if (!startDate || !endDate || endDate <= startDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.round(diff / 86400000);
  }, [startDate, endDate]);

  const totalPrice = gear ? days * gear.pricePerDay : 0;

  const addToCart = useCartStore((s) => s.add);

  const handleAddToCart = () => {
    if (!gear) return;
    if (days < 1) {
      toast.error('Please pick a valid start and end date.');
      return;
    }
    if (bookingConflict) {
      toast.error(bookingConflict);
      return;
    }
    addToCart({ gearId: gear.id, startDate, endDate });
    toast.success('Added to cart.');
  };

  const handleRent = () => {
    if (!gear) return;
    if (days < 1) {
      toast.error('Please pick a valid start and end date.');
      return;
    }
    if (bookingConflict) {
      toast.error(bookingConflict);
      return;
    }
    if (!user) {
      router.push(`/login?redirectTo=/gear/${gear.id}`);
      return;
    }
    router.push(
      `/checkout?gearId=${gear.id}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="aspect-[4/3] rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded-full bg-muted" />
              <div className="h-4 w-1/2 rounded-full bg-muted" />
              <div className="h-40 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !gear) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-2xl font-bold">Gear not found</h1>
          <p className="mt-2 text-muted-foreground">
            This item may have been removed or the backend is unreachable.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button asChild variant="outline">
              <Link href="/gear">Back to browse</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link href="/gear" className="transition hover:text-primary">
            Gear
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="truncate font-medium text-foreground">{gear.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <GearImage
                gear={gear}
                src={activeImage ?? galleryImages[0]}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-3">
                {galleryImages.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    aria-label={`View image ${i + 1} of ${galleryImages.length}`}
                    aria-current={(activeImage ?? galleryImages[0]) === src}
                    className={cn(
                      'relative aspect-[16/10] w-28 overflow-hidden rounded-xl ring-2 transition',
                      (activeImage ?? galleryImages[0]) === src
                        ? 'ring-primary'
                        : 'ring-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <GearImage gear={gear} src={src} fill sizes="112px" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{gear.name}</h1>
                <WishlistButton
                  gearId={gear.id}
                  className="size-10"
                  activeClassName="bg-primary/10 dark:bg-primary/10"
                />
                {gear.category?.name && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {gear.category.name}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {typeof gear.averageRating === 'number' && gear.averageRating > 0 && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <RatingStars rating={gear.averageRating} />
                      <span className="font-medium text-foreground">
                        {gear.averageRating.toFixed(1)}
                      </span>
                    </span>
                    <span>·</span>
                  </>
                )}
                <span>{gear.totalReviews} review{gear.totalReviews === 1 ? '' : 's'}</span>
                <span>·</span>
                <span>
                  <HugeiconsIcon icon={MapPinIcon} className="mr-1 inline size-4" strokeWidth={2} />
                  {gear.brand}
                </span>
              </div>

              <p className="mt-6 max-w-2xl leading-relaxed text-foreground/80">
                {gear.description}
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <span className="font-semibold">Specifications</span>
                  <span className="text-xs text-muted-foreground">
                    {Object.keys(gear.specifications ?? {}).length + 1} details
                  </span>
                </div>
                <div className="grid gap-x-8 gap-y-3 p-5 sm:grid-cols-2">
                  {Object.entries(gear.specifications ?? {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                    >
                      <span className="capitalize text-muted-foreground">{key.replace(/[_-]/g, ' ')}</span>
                      <span className="font-medium text-right">{String(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Stock</span>
                    <span className="font-medium">{gear.stockQuantity} available</span>
                  </div>
                </div>
              </div>

              {gear.provider && (
                <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-fuchsia-500/20 text-lg font-bold text-primary">
                    {gear.provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{gear.provider.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{gear.provider.email}</p>
                  </div>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
                    <HugeiconsIcon icon={BadgeCheckIcon} className="size-4" strokeWidth={2} />
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit overflow-hidden rounded-2xl border border-border/60 bg-card lg:sticky lg:top-20">
            <div className="pointer-events-none h-1 w-full bg-gradient-to-r from-primary via-indigo-500 to-fuchsia-500" />
            <div className="p-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-primary">${gear.pricePerDay.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground"> / day</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    gear.availability ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                  }`}
                >
                  {gear.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Start date</span>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-input/30 px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">End date</span>
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-input/30 px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </label>
              </div>

              {isCustomer && blockedRanges.length > 0 && (
                <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
                  <p className="font-medium">Your existing bookings on this gear:</p>
                  <ul className="mt-1 space-y-0.5">
                    {blockedRanges.map((b, i) => (
                      <li key={`${b.start}-${i}`} className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Calendar02Icon} className="size-3.5 shrink-0" strokeWidth={2} />
                        {new Date(`${b.start}T00:00:00`).toLocaleDateString()} →{' '}
                        {new Date(`${b.end}T00:00:00`).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bookingConflict && (
                <div className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  <p className="font-medium">Dates overlap your booking</p>
                  <p className="mt-0.5">{bookingConflict}</p>
                </div>
              )}

              <div className="mt-6 space-y-2 border-t border-border/60 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium tabular-nums">
                    {days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ${gear.pricePerDay.toFixed(2)} × {days > 0 ? days : '—'}
                  </span>
                  <span className="font-medium tabular-nums">
                    {days > 0 ? `$${totalPrice.toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between rounded-lg bg-primary/5 px-3 py-2 font-semibold">
                  <span>Total</span>
                  <span className="text-primary tabular-nums">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full py-3 text-base"
                disabled={!gear.availability || !!bookingConflict || (!!user && !isCustomer)}
                onClick={handleRent}
              >
                {user ? (isCustomer ? 'Rent Now' : 'Providers can’t rent gear') : 'Rent Now — Sign in first'}
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full py-3 text-base"
                disabled={!!bookingConflict || (!!user && !isCustomer)}
                onClick={handleAddToCart}
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} className="size-4" strokeWidth={2} />
                Add to Cart
              </Button>
              {bookingConflict && (
                <p className="mt-3 text-center text-xs text-red-600 dark:text-red-400">
                  Pick dates outside your existing booking.
                </p>
              )}
              {!gear.availability && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  This item is currently unavailable.
                </p>
              )}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Calendar02Icon} className="size-3.5" strokeWidth={2} />
                Past dates are blocked automatically
              </p>
            </div>
          </aside>
        </div>

        {(gear.reviews?.length ?? 0) > 0 && (
          <section className="mt-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Customer reviews</h2>
                <p className="mt-1 text-muted-foreground">
                  What renters say about this gear
                </p>
              </div>
              {typeof gear.averageRating === 'number' && gear.averageRating > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2">
                  <span className="text-xl font-bold text-primary">
                    {gear.averageRating.toFixed(1)}
                  </span>
                  <RatingStars rating={gear.averageRating} />
                  <span className="text-xs text-muted-foreground">
                    {gear.totalReviews} review{gear.totalReviews === 1 ? '' : 's'}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(gear.reviews ?? []).map((review, i) => (
                <div
                  key={review.id ?? `review-${i}`}
                  className="animate-fade-up flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-fuchsia-500/20 text-sm font-bold text-primary">
                        {(review.customer?.name ?? 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {review.customer?.name ?? 'GearUp customer'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Verified rental'}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <RatingStars rating={review.rating} />
                      <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm leading-relaxed text-foreground/80">{review.comment}</p>
                  )}
                  <span className="mt-auto flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <HugeiconsIcon icon={BadgeCheckIcon} className="size-3.5" strokeWidth={2} />
                    Verified rental
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">You might also like</h2>
              <Link
                href="/gear"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Browse all
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((g) => (
                <GearCard key={g.id} gear={g} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}