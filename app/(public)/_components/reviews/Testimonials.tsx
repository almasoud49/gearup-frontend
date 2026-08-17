'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheckIcon, QuoteUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Reveal from '@/app/(public)/_components/motion/Reveal';
import { RatingStars } from '@/app/(public)/_components/gear/RatingStars';
import { Button } from '@/components/ui/button';
import { getReviews } from '@/app/(public)/_actions/rentalActions';

function initials(name: string | undefined) {
  return (name ?? 'G')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function gradientFor(name: string | undefined) {
  const palettes = [
    'from-emerald-500 to-teal-600',
    'from-indigo-500 to-violet-600',
    'from-fuchsia-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-sky-500 to-blue-600',
  ];
  const seed = (name ?? 'gearup').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palettes[seed % palettes.length];
}

export default function Testimonials() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => getReviews({ limit: 6 }),
    retry: 1,
  });

  const reviews = data?.success ? (data.data ?? []) : [];
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  return (
    <section className="relative isolate overflow-hidden mx-auto max-w-7xl px-4 py-14 sm:px-6">
      {/* decorative ellipses */}
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 size-64 rounded-full border border-fuchsia-500/20 mix-blend-soft-light blur-[1px]" />

      <div className="mb-8">
        <Reveal>
          <div className="relative">
            <span className="pointer-events-none absolute -top-6 left-0 select-none text-4xl font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1px_var(--border)] sm:text-6xl">
              Renters
            </span>
            <h2 className="relative text-2xl font-bold sm:text-3xl">What renters are saying</h2>
            <p className="relative mt-1 text-muted-foreground">
              {reviews.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  Rated {average.toFixed(1)} / 5 by renters on GearUp
                </span>
              )}
            </p>
          </div>
        </Reveal>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="size-11 animate-pulse rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/40 dark:bg-red-500/10">
          <p className="font-medium text-red-700 dark:text-red-400">
            Couldn&apos;t load reviews. Make sure the backend is running.
          </p>
          <Button className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
          <p className="text-muted-foreground">No reviews yet — be the first to share an experience.</p>
          <Button asChild className="mt-4">
            <Link href="/gear">Browse gear</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.id ?? `review-${i}`} delay={(i % 3) * 100}>
              <figure className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <HugeiconsIcon
                  icon={QuoteUpIcon}
                  className="absolute right-5 top-5 size-8 text-primary/15"
                  strokeWidth={2}
                />
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={Number(review.rating)} />
                  <span className="ml-auto text-xs font-semibold text-primary">
                    {Number(review.rating).toFixed(1)}
                  </span>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientFor(review.customer?.name)} text-sm font-bold text-white shadow-sm`}
                  >
                    {initials(review.customer?.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      {review.customer?.name ?? 'GearUp customer'}
                      <HugeiconsIcon icon={BadgeCheckIcon} className="size-4 shrink-0 text-primary" strokeWidth={2} />
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {review.gearItem?.name ? `Rented: ${review.gearItem.name}` : 'Verified rental'}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}