'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, Message01Icon } from '@hugeicons/core-free-icons';

import type { GearItem } from '@/lib/types';
import { RatingStars } from '@/app/(public)/_components/gear/RatingStars';
import GearImage from '@/app/(public)/_components/gear/GearImage';
import WishlistButton from '@/app/(public)/_components/gear/WishlistButton';
import { Button } from '@/components/ui/button';

export default function GearCard({ gear }: { gear: GearItem }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl">
      <Link
        href={`/gear/${gear.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <GearImage
          gear={gear}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* shine sweep */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
<span
            className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md dark:bg-card/90 ${
              gear.availability
                ? 'bg-white/90 text-green-700 dark:text-green-400'
                : 'bg-white/90 text-red-600 dark:text-red-400'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${gear.availability ? 'bg-green-500' : 'bg-red-500'}`}
            />
            {gear.availability ? 'Available' : 'Unavailable'}
          </span>
          <WishlistButton
            gearId={gear.id}
            className="absolute right-3 top-3"
            activeClassName="bg-white/90 dark:bg-card/90"
          />
        </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {gear.category?.name && (
          <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
            {gear.category.name}
          </p>
        )}
        <Link href={`/gear/${gear.id}`} className="line-clamp-1 font-semibold leading-snug transition-colors hover:text-primary">
          {gear.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{gear.description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <span className="text-lg font-bold text-primary">
              ${gear.pricePerDay.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground"> / day</span>
          </div>
          <div className="flex items-center gap-2">
            {typeof gear.averageRating === 'number' && gear.averageRating > 0 && (
              <>
                <RatingStars rating={gear.averageRating} />
                <span className="text-xs text-muted-foreground">
                  ({gear.averageRating.toFixed(1)})
                </span>
              </>
            )}
            {gear.totalReviews ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Message01Icon} className="size-3.5" strokeWidth={2} />
                {gear.totalReviews}
              </span>
            ) : null}
          </div>
        </div>

        {gear.availability ? (
          <Button asChild size="sm" className="mt-2 w-full">
            <Link href={`/gear/${gear.id}`}>
              Rent Now
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
            </Link>
          </Button>
        ) : (
          <Button size="sm" className="mt-2 w-full" disabled>
            Unavailable
          </Button>
        )}
      </div>
    </div>
  );
}