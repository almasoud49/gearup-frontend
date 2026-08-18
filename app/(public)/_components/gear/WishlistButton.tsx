'use client';

import { HeartIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/lib/wishlistStore';

export default function WishlistButton({
  gearId,
  className,
  activeClassName,
}: {
  gearId: string;
  className?: string;
  activeClassName?: string;
}) {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const active = ids.includes(gearId);

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(gearId);
      }}
      className={cn(
        'flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 dark:bg-card/90',
        className
      )}
    >
      <HugeiconsIcon
        icon={HeartIcon}
        className={cn('size-4.5 transition-colors', active ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300', activeClassName)}
        strokeWidth={2}
      />
    </button>
  );
}