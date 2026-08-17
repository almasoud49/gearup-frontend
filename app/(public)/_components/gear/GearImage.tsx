'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  TentIcon,
  SkiIcon,
  BicycleIcon,
  Dumbbell01Icon,
  GolfBallIcon,
  MapPinIcon,
  CricketBatIcon,
  Yoga01Icon,
  KayakIcon,
  Home03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { cn } from '@/lib/utils';
import { categoryImage } from '@/lib/images';
import type { GearItem } from '@/lib/types';

type IconToken = typeof Home03Icon;

const CATEGORY_THEMES: Record<string, { gradient: string; icon: IconToken; label: string }> = {
  Camping: { gradient: 'from-emerald-500 to-teal-700', icon: TentIcon, label: 'Camping' },
  'Climbing & Mountaineering': {
    gradient: 'from-stone-500 to-slate-800',
    icon: SkiIcon,
    label: 'Climbing',
  },
  Cycling: { gradient: 'from-sky-500 to-blue-700', icon: BicycleIcon, label: 'Cycling' },
  Fitness: { gradient: 'from-rose-500 to-red-700', icon: Dumbbell01Icon, label: 'Fitness' },
  Golf: { gradient: 'from-lime-500 to-green-700', icon: GolfBallIcon, label: 'Golf' },
  Hiking: { gradient: 'from-amber-500 to-orange-700', icon: MapPinIcon, label: 'Hiking' },
  'Racket Sports': { gradient: 'from-fuchsia-500 to-purple-700', icon: CricketBatIcon, label: 'Racket' },
  'Running & Jogging': { gradient: 'from-indigo-500 to-violet-700', icon: Yoga01Icon, label: 'Running' },
  'Water Sports': { gradient: 'from-cyan-500 to-blue-700', icon: KayakIcon, label: 'Water' },
};

const DEFAULT_THEME = { gradient: 'from-primary to-indigo-700', icon: Home03Icon, label: 'Gear' };

export function categoryTheme(name?: string) {
  const theme =
    (name && CATEGORY_THEMES[name]) ||
    (name && CATEGORY_THEMES[Object.keys(CATEGORY_THEMES).find((k) => name.toLowerCase().includes(k.toLowerCase())) ?? '']) ||
    DEFAULT_THEME;
  return theme;
}

export function isRenderedImage(url?: string): boolean {
  const u = (url ?? '').trim();
  if (!u || u.startsWith('/')) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol.startsWith('http') && parsed.hostname !== 'example.com';
  } catch {
    return false;
  }
}

export function GradientTile({
  gear,
  className,
  compact,
}: {
  gear: Pick<GearItem, 'name' | 'category'>;
  className?: string;
  compact?: boolean;
}) {
  const theme = categoryTheme(gear.category?.name);
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-white',
        theme.gradient,
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
      <HugeiconsIcon
        icon={theme.icon}
        className={cn('text-white/35', compact ? 'size-10' : 'size-20')}
        strokeWidth={1.5}
      />
      <span className="absolute bottom-2 right-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
        {theme.label}
      </span>
    </div>
  );
}

export default function GearImage({
  gear,
  src,
  alt,
  sizes,
  priority,
  className,
  fill,
}: {
  gear: Pick<GearItem, 'name' | 'category' | 'images'>;
  src?: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
}) {
  const [failed, setFailed] = useState<'source' | 'category' | null>(null);

  const sourceUrl = src ?? gear.images?.[0];
  const sourceValid = isRenderedImage(sourceUrl);
  const category = categoryImage(gear.category?.name);

  let displayed: string | undefined;
  if (sourceValid && failed !== 'source') {
    displayed = sourceUrl;
  } else if (category && failed !== 'category') {
    displayed = category;
  }

  if (!displayed) {
    return (
      <GradientTile
        gear={{ name: gear.name, category: gear.category }}
        className={cn('h-full w-full', className)}
      />
    );
  }

  const isCategory = !sourceValid || failed === 'source';

  return (
    <Image
      src={displayed}
      alt={alt ?? gear.name}
      fill={fill}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(isCategory ? 'category' : 'source')}
      className={cn('object-cover', className)}
    />
  );
}