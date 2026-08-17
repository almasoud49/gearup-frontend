'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight02Icon,
  Search01Icon,
  Calendar02Icon,
  CreditCardIcon,
  BadgeCheckIcon,
  TruckIcon,
  CheckmarkCircle01Icon,
  ShieldIcon,
  GridViewIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import Reveal from '@/app/(public)/_components/motion/Reveal';
import Parallax from '@/app/(public)/_components/motion/Parallax';
import GearCard from '@/app/(public)/_components/gear/GearCard';
import GearCardSkeleton from '@/app/(public)/_components/gear/GearCardSkeleton';
import GearImage, { categoryTheme } from '@/app/(public)/_components/gear/GearImage';
import Testimonials from '@/app/(public)/_components/reviews/Testimonials';
import { Button } from '@/components/ui/button';
import { getAllGear, getCategories } from '@/app/(public)/_actions/gearActions';
import { cn } from '@/lib/utils';
import { HERO_IMAGE, unsplashUrl } from '@/lib/images';
import type { GearItem } from '@/lib/types';

const STEPS = [
  {
    icon: Search01Icon,
    title: 'Discover gear',
    text: 'Browse hundreds of premium sports items from verified providers near you.',
  },
  {
    icon: Calendar02Icon,
    title: 'Pick your dates',
    text: 'Choose start and end dates and see a live total before you commit.',
  },
  {
    icon: CreditCardIcon,
    title: 'Pay & play',
    text: 'Book instantly with secure Stripe payment — no deposits, no hassle.',
  },
];

export default function HomePage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['gear', 'featured'],
    queryFn: () => getAllGear({ limit: 8, availability: true }),
  });
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const { data: countsData } = useQuery({
    queryKey: ['gear', 'home-counts'],
    queryFn: () => getAllGear({ limit: 100, availability: true }),
  });

  const items = data?.data ?? [];
  const categories = categoriesData?.data ?? [];
  const categoryCounts = (countsData?.data ?? []).reduce<Record<string, number>>((acc, g) => {
    if (g.categoryId) acc[g.categoryId] = (acc[g.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  const cheapest = items.reduce<number | null>(
    (min, g) => (min === null || g.pricePerDay < min ? g.pricePerDay : min),
    null
  );

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative isolate overflow-hidden bg-indigo-950 text-white">
        {/* parallax blended background photo */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-blend-multiply"
          style={{
            backgroundImage: `url("${unsplashUrl(HERO_IMAGE, 2000)}")`,
            backgroundColor: '#1e1b4b',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-950/95 via-indigo-950/60 to-indigo-900/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-indigo-950 to-transparent" />

        {/* giant outlined watermark */}
        <div className="animate-float pointer-events-none absolute left-1/2 top-16 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[19vw] font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)]">
          Adventure
        </div>

        {/* ellipse orbs — blend-mode glow decorations */}
        <div className="animate-float pointer-events-none absolute -right-24 top-1/4 -z-10 size-96 rounded-full bg-fuchsia-500/50 blur-3xl mix-blend-screen" />
        <div
          className="animate-float pointer-events-none absolute -left-24 bottom-8 -z-10 size-80 rounded-full bg-sky-400/40 blur-3xl mix-blend-screen"
          style={{ animationDelay: '2.2s' }}
        />
        <div className="pointer-events-none absolute left-1/3 top-0 -z-10 size-[28rem] -translate-x-1/2 rounded-[50%] border border-white/10 mix-blend-soft-light blur-[2px]" />
        <div className="pointer-events-none absolute -bottom-24 left-8 -z-10 size-64 rounded-full border border-fuchsia-300/20 mix-blend-screen blur-sm" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="animate-fade-up mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <HugeiconsIcon icon={TruckIcon} className="size-3.5" strokeWidth={2} />
              Rent sports &amp; outdoor gear instantly
            </p>
            <h1 className="animate-fade-up animation-delay-100 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Gear up for your{' '}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                next adventure
              </span>
            </h1>
            <p className="animate-fade-up animation-delay-200 mt-5 max-w-lg text-white/85">
              From mountain bikes to kayaks, rent premium equipment by the day — no heavy
              investments, just pure play.
            </p>
            <div className="animate-fade-up animation-delay-300 mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                <Link href="/gear">
                  Browse Gear
                  <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/register">Become a Provider</Link>
              </Button>
            </div>

            <div className="animate-fade-up animation-delay-400 mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6">
              <div>
                <p className="text-2xl font-extrabold">{isLoading ? '…' : items.length}+</p>
                <p className="text-xs text-white/70">Gear items</p>
              </div>
              <div className="border-l border-white/15 pl-6">
                <p className="text-2xl font-extrabold">{categories.length || '…'}</p>
                <p className="text-xs text-white/70">Categories</p>
              </div>
              <div className="border-l border-white/15 pl-6">
                <p className="text-2xl font-extrabold">
                  {cheapest != null ? `$${cheapest.toFixed(2)}` : '…'}
                </p>
                <p className="text-xs text-white/70">From / day</p>
              </div>
            </div>
          </div>

          <Parallax speed={0.1} className="relative hidden lg:block">
            <div className="group relative rotate-2 overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-700 hover:rotate-0">
              <div className="relative aspect-[4/5] [mask-image:linear-gradient(160deg,black_62%,transparent_96%)]">
                <Image
                  src={unsplashUrl('photo-1502680390469-be75c86b636f', 1200)}
                  alt="Surfing gear ready for adventure"
                  fill
                  priority
                  sizes="50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-fuchsia-400/40 mix-blend-soft-light" />
              </div>
            </div>

            <div className="animate-float absolute -left-8 top-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
              <p className="text-xs text-white/70">Day rates from</p>
              <p className="text-lg font-bold">
                {cheapest != null ? `$${cheapest.toFixed(2)}` : '—'}
              </p>
            </div>
            <div
              className="animate-float absolute -right-4 bottom-16 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md"
              style={{ animationDelay: '1.6s' }}
            >
              <HugeiconsIcon icon={ShieldIcon} className="size-5 text-emerald-300" strokeWidth={2} />
              <p className="text-sm font-semibold">Secure payment</p>
            </div>
          </Parallax>
        </div>
      </section>

      {/* Marquee trust strip */}
      <div className="overflow-hidden border-b border-border/60 bg-muted py-4">
        <div className="animate-marquee flex w-max items-center gap-12">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-12" aria-hidden={copy === 1}>
              {[
                { icon: GridViewIcon, label: 'Gear for every sport' },
                { icon: BadgeCheckIcon, label: 'Verified providers' },
                { icon: ShieldIcon, label: 'Secure Stripe payments' },
                { icon: Calendar02Icon, label: 'Flexible day-by-day booking' },
                { icon: CheckmarkCircle01Icon, label: 'Instant confirmation' },
              ].map((t) => (
                <span key={t.label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <HugeiconsIcon icon={t.icon} className="size-4 text-primary" strokeWidth={2} />
                  {t.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 size-72 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <span className="pointer-events-none absolute -top-6 left-0 select-none text-4xl font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1px_var(--border)] sm:text-6xl">
              Shop
            </span>
            <h2 className="relative text-2xl font-bold sm:text-3xl">Shop by category</h2>
            <p className="relative mt-1 text-muted-foreground">Find exactly what your adventure needs</p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/gear">
              View all
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
            </Link>
          </Button>
        </div>

        {/* bento grid — first category featured as a large tall card */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, idx) => {
            const theme = categoryTheme(c.name);
            const sample = items.find((g) => g.categoryId === c.id);
            const inStock = categoryCounts[c.id] ?? 0;
            const featured = idx === 0;
            return (
              <Reveal
                key={c.id}
                delay={(idx % 4) * 80}
                className={cn(featured && 'sm:col-span-2 sm:row-span-2')}
              >
                <Link
                  href="/gear"
                  className={cn(
                    'group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl',
                    featured ? 'min-h-[22rem] p-7 lg:min-h-full' : 'aspect-[16/12] p-5'
                  )}
                >
                  {/* real category photo background */}
                  <div className="absolute inset-0 -z-20 overflow-hidden">
                    <GearImage
                      gear={
                        sample ??
                        ({
                          name: c.name,
                          category: { id: c.id, name: c.name },
                          images: [],
                        } satisfies Pick<GearItem, 'name' | 'category' | 'images'>)
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                    />
                  </div>
                  {/* blend-mode color wash on top of the photo */}
                  <div
                    className={cn(
                      'absolute inset-0 -z-10 bg-gradient-to-br opacity-80 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-90',
                      theme.gradient
                    )}
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="pointer-events-none absolute -right-6 -top-6 -z-10 size-24 rounded-full border border-white/25 mix-blend-soft-light transition-all duration-500 group-hover:scale-150" />

                  {/* floating watermark icon */}
                  <HugeiconsIcon
                    icon={theme.icon}
                    strokeWidth={featured ? 1 : 1.5}
                    className={cn(
                      'pointer-events-none absolute right-4 text-white/25 transition-all duration-500 group-hover:rotate-6 group-hover:text-white/40',
                      featured ? 'top-4 size-16' : 'top-3 size-10'
                    )}
                  />

                  {/* content */}
                  <div className="relative z-10">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/75">
                      <span className="size-1.5 rounded-full bg-white/80" />
                      {inStock > 0 ? `${inStock} item${inStock === 1 ? '' : 's'}` : 'Available now'}
                    </p>
                    <h3 className={cn('mt-1.5 font-bold text-white', featured ? 'text-2xl' : 'text-lg')}>
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80">
                      {sample
                        ? `Rentals from $${sample.pricePerDay.toFixed(2)}/day`
                        : 'Browse the collection'}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 group-hover:gap-2.5 group-hover:bg-white group-hover:text-slate-900">
                      Explore
                      <HugeiconsIcon icon={ArrowRight02Icon} className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                    </span>
                  </div>

                  {/* featured card shine sweep */}
                  <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative isolate overflow-hidden mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* decorative ellipse behind the heading */}
        <div className="pointer-events-none absolute -right-20 top-0 -z-10 size-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-16 -z-10 size-64 rounded-full border border-primary/20 mix-blend-soft-light blur-[1px]" />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <span className="pointer-events-none absolute -top-6 left-0 select-none text-4xl font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1px_var(--border)] sm:text-6xl">
              Featured
            </span>
            <h2 className="relative text-2xl font-bold sm:text-3xl">Featured gear</h2>
            <p className="relative mt-1 text-muted-foreground">Handpicked equipment ready for rent</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/gear">
              View all
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
            </Link>
          </Button>
        </div>

        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/40 dark:bg-red-500/10">
            <p className="font-medium text-red-700 dark:text-red-400">
              Couldn&apos;t load gear. Make sure the backend is running.
            </p>
            <Button className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <GearCardSkeleton key={i} />)
              : items.map((gear, idx) => (
                  <Reveal key={gear.id} delay={(idx % 4) * 80}>
                    <GearCard gear={gear} />
                  </Reveal>
                ))}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
            <p className="text-muted-foreground">No gear available right now.</p>
          </div>
        )}
      </section>

      <section className="relative isolate overflow-hidden bg-slate-950 py-20 text-white">
        {/* ellipse decorations + gradient overlays */}
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 size-[26rem] rounded-full border border-indigo-400/20 mix-blend-screen blur-[2px]" />
        <div className="animate-float pointer-events-none absolute -right-28 bottom-0 -z-10 size-[22rem] rounded-full bg-fuchsia-600/20 blur-3xl mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative mb-10">
            <span className="pointer-events-none absolute -top-7 left-0 select-none text-4xl font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] sm:text-6xl">
              Moments
            </span>
            <h2 className="relative text-2xl font-bold sm:text-3xl">Made for the outdoors</h2>
            <p className="relative mt-1 text-white/60">
              A taste of the adventures awaiting with borrowed gear.
            </p>
          </div>

          <div className="columns-2 gap-4 lg:columns-3">
            {[
              { id: 'photo-1502680390469-be75c86b636f', alt: 'Ocean surf', h: 'aspect-[3/4]' },
              { id: 'photo-1551632811-561732d1e306', alt: 'Forest hike', h: 'aspect-square' },
              { id: 'photo-1464822759023-fed622ff2c3b', alt: 'Mountain summit', h: 'aspect-[4/5]' },
              { id: 'photo-1485965120184-e220f721d03e', alt: 'Road cycling', h: 'aspect-[3/4]' },
              { id: 'photo-1535131749006-b7f58c99034b', alt: 'Fitness session', h: 'aspect-square' },
              { id: 'photo-1504280390367-361c6d9f38f4', alt: 'Campsite nights', h: 'aspect-[4/5]' },
              { id: 'photo-1554068865-24cecd4e34b8', alt: 'Golf at dawn', h: 'aspect-[3/4]' },
              { id: 'photo-1622279457486-62dcc4a431d6', alt: 'Racket court', h: 'aspect-square' },
              { id: 'photo-1461896836934-ffe607ba8211', alt: 'Morning run', h: 'aspect-[3/4]' },
            ].map((p, i) => (
              <div key={p.id + i} className="mb-4 break-inside-avoid">
                <Reveal delay={(i % 3) * 100}>
                  <div className="group relative overflow-hidden rounded-2xl">
                    <div className={`relative ${p.h} w-full overflow-hidden`}>
                      <Image
                        src={unsplashUrl(p.id, 800)}
                        alt={p.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                      <span className="absolute bottom-4 left-4 translate-y-1 text-sm font-semibold text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white">
                        {p.alt}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-950 hover:bg-indigo-50"
            >
              <Link href="/gear">
                Start your adventure
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-muted">
        <div className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="pointer-events-none absolute left-1/2 -top-8 -translate-x-1/2 select-none whitespace-nowrap text-5xl font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1px_var(--border)] sm:text-7xl">
              How it works
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Rent in three steps
            </p>
            <h2 className="mt-2 text-3xl font-bold">From browsed to broken-in</h2>
            <p className="mt-2 text-muted-foreground">
              Book gear in minutes — no paperwork, no deposits, no hassle.
            </p>
          </div>

          <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {/* connecting line */}
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent sm:block" />

            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 130}>
                <div className="group relative h-full text-center">
                  {/* gradient number badge */}
                  <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
                    <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <HugeiconsIcon icon={step.icon} className="size-7 text-primary" strokeWidth={2} />
                    <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-xs font-bold text-primary-foreground shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/gear" className="gap-2">
                  Browse gear and get started
                  <HugeiconsIcon icon={ArrowRight02Icon} className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/register">Become a provider</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl border border-border/70 bg-card p-8 shadow-sm sm:p-10">
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center opacity-60 dark:opacity-40"
              style={{
                backgroundImage: `url("${unsplashUrl('photo-1504280390367-361c6d9f38f4', 1600)}")`,
                backgroundAttachment: 'fixed',
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-card/95 via-card/90 to-card/45 dark:from-card/95 dark:via-card/85 dark:to-card/30" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 -z-10 size-52 rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
            <div className="pointer-events-none absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-fuchsia-500/20 blur-3xl mix-blend-screen" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-indigo-500 to-fuchsia-500" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Search the catalog
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">Looking for something specific?</h2>
                <p className="mt-2 text-muted-foreground">
                  Search by brand, price, or category to find your perfect match.
                </p>
              </div>
              <Button asChild size="lg" className="gap-2">
                <Link href="/gear">
                  <HugeiconsIcon icon={Search01Icon} className="size-4" strokeWidth={2} />
                  Explore the catalog
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}