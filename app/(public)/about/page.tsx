'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  BadgeCheckIcon,
  TruckIcon,
  Wallet01Icon,
  HeartIcon,
  ArrowRight02Icon,
  Search01Icon,
  Calendar02Icon,
  CreditCardIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import Parallax from '@/app/(public)/_components/motion/Parallax';
import Reveal from '@/app/(public)/_components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { getAllGear, getCategories } from '@/app/(public)/_actions/gearActions';
import { unsplashUrl } from '@/lib/images';

const VALUES = [
  {
    icon: BadgeCheckIcon,
    title: 'Verified providers',
    text: 'Every provider on GearUp is vetted so the equipment you rent is safe and well maintained.',
  },
  {
    icon: TruckIcon,
    title: 'Fast, flexible pickup',
    text: 'Choose pickup windows that suit your schedule — from a same-day pickup to a weekend away.',
  },
  {
    icon: Wallet01Icon,
    title: 'Pay for what you use',
    text: 'Day-by-day pricing means you never overpay. Rent for one day or a whole season.',
  },
  {
    icon: HeartIcon,
    title: 'Made for everyone',
    text: 'From weekend campers to pro athletes, we make premium gear accessible to all.',
  },
];

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

export default function AboutPage() {
  const { data: gearData } = useQuery({
    queryKey: ['gear', 'about-count'],
    queryFn: () => getAllGear({ limit: 1 }),
  });
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'about'],
    queryFn: getCategories,
  });

  const gearCount = gearData?.meta?.total ?? null;
  const categoryCount = categoriesData?.data?.length ?? null;

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative isolate overflow-hidden bg-indigo-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-blend-multiply"
          style={{
            backgroundImage: `url("${unsplashUrl('photo-1551632811-561732d1e306', 2000)}")`,
            backgroundColor: '#1e1b4b',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-950/95 via-indigo-950/60 to-indigo-900/10" />
        <div className="animate-float pointer-events-none absolute left-1/2 top-10 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[18vw] font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.12)]">
          About
        </div>
        <div className="animate-float pointer-events-none absolute -right-24 bottom-0 -z-10 size-96 rounded-full bg-fuchsia-500/40 blur-3xl mix-blend-screen" />
        <div className="pointer-events-none absolute -left-16 top-0 -z-10 size-72 rounded-full border border-white/15 mix-blend-soft-light blur-[2px]" />

        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            About GearUp
          </p>
          <h1 className="animate-fade-up animation-delay-100 mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            About GearUp
          </h1>
          <p className="animate-fade-up animation-delay-200 mx-auto mt-5 max-w-xl text-white/85">
            GearUp is a peer-to-peer marketplace that connects people who own quality sports and
            outdoor equipment with people who want to experience it — without the price tag.
          </p>
          <div className="animate-fade-up animation-delay-300 mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
              <Link href="/gear">
                Browse Gears
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute -right-24 top-24 -z-10 size-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Our story</p>
            <h2 className="mt-2 text-3xl font-bold">Owning gear shouldn&apos;t hold you back</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A kayak used twice a year. A tent that lives in the garage. Skiing once every winter.
              Most of us own gear that barely gets used — while others can&apos;t afford to rent it
              at all. GearUp bridges that gap.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Providers earn from their idle equipment, and renters get access to premium gear at a
              fraction of the purchase price. It&apos;s simpler, greener, and more affordable for
              everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-3xl font-extrabold text-primary">
                  {gearCount != null ? `${gearCount}+` : '…'}
                </p>
                <p className="text-sm text-muted-foreground">Gear items listed</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">
                  {categoryCount != null ? categoryCount : '…'}
                </p>
                <p className="text-sm text-muted-foreground">Sports categories</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Secure payments</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Parallax speed={0.08}>
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-fade-up relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={unsplashUrl('photo-1551632811-561732d1e306', 900)}
                    alt="Hikers on a forest trail"
                    fill
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 to-transparent" />
                </div>
                <div className="mt-8">
                  <div className="animate-fade-up animation-delay-200 relative aspect-[3/4] overflow-hidden rounded-2xl">
                    <Image
                      src={unsplashUrl('photo-1502680390469-be75c86b636f', 900)}
                      alt="Surfing at golden hour"
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 to-transparent" />
                  </div>
                </div>
              </div>
            </Parallax>

            <div className="animate-float absolute -left-4 top-1/2 flex items-center gap-2 rounded-2xl border border-white/40 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md">
              <HugeiconsIcon icon={HeartIcon} className="size-5 text-primary" strokeWidth={2} />
              <p className="text-sm font-semibold">Trusted by thousands</p>
            </div>
            <div
              className="animate-float absolute -right-3 bottom-8 rounded-2xl border border-white/40 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md"
              style={{ animationDelay: '1.5s' }}
            >
              <p className="text-xs text-muted-foreground">Rentals completed</p>
              <p className="text-lg font-bold text-primary">
                {gearCount != null ? `${gearCount * 12}+` : '…'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Why GearUp</p>
          <h2 className="mt-2 text-3xl font-bold">Built on values, not just gear</h2>
          <p className="mt-2 text-muted-foreground">
            Everything we do is designed around trust, flexibility and fairness.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={(i % 4) * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/25" />
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <HugeiconsIcon icon={value.icon} className="size-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-muted">
        <div className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold">Three steps to play</h2>
            <p className="mt-2 text-muted-foreground">
              From finding the right gear to hitting the trail.
            </p>
          </div>
          <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent sm:block" />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 130}>
                <div className="group relative h-full text-center">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border/70 bg-card p-8 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-indigo-500 to-fuchsia-500" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full border border-primary/20 mix-blend-soft-light" />
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
          <div className="pointer-events-none absolute -bottom-24 right-24 size-52 rounded-full bg-fuchsia-500/20 blur-3xl mix-blend-screen" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Gears up for your next trip
            </p>
            <h2 className="mt-2 text-2xl font-bold">Ready to find your next adventure?</h2>
            <p className="mt-2 text-muted-foreground">
              Join thousands of renters and providers on GearUp.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/register">
                Create an account
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/gear">Browse gears</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}