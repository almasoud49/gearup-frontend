'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dumbbell01Icon,
  Home01Icon,
  GridViewIcon,
  DashboardSquare01Icon,
  Login03Icon,
  ArrowRight01Icon,
  Mail01Icon,
  CallIcon,
  Facebook01Icon,
  InstagramIcon,
  TwitterIcon,
  Linkedin01Icon,
  ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLE_HOME, useAuthStore } from '@/lib/auth';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Gears', href: '/gear' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const SOCIALS = [
  { icon: Facebook01Icon, label: 'Facebook' },
  { icon: InstagramIcon, label: 'Instagram' },
  { icon: TwitterIcon, label: 'Twitter' },
  { icon: Linkedin01Icon, label: 'LinkedIn' },
];

export default function Footer() {
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setEmail('');
    toast.success('Subscribed! Watch your inbox for deals.');
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* animated gradient top bar */}
      <div className="h-1 w-full animate-gradient-x bg-gradient-to-r from-primary via-amber-400 to-fuchsia-500" />

      {/* grid pattern + ellipse orbs overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.6) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/25 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute -left-28 bottom-10 size-80 rounded-full bg-fuchsia-600/20 blur-3xl mix-blend-screen" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* CTA banner — subdued, on-theme */}
        <div className="-translate-y-px pb-4">
          <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/30 blur-3xl mix-blend-screen" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-fuchsia-600/20 blur-3xl mix-blend-screen" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-indigo-500 to-fuchsia-500" />
            <div className="relative flex flex-col items-start justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center sm:px-9">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Ready for your next adventure?
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                  Join thousands of renters &amp; providers.
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Rent gear by the day — or list your own and start earning today.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-indigo-50">
                  <Link href="/register">Get started</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:border-primary hover:bg-primary/20"
                >
                  <Link href="/gear">Browse gears</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex w-fit items-center gap-2 text-lg font-bold text-white">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground">
                <HugeiconsIcon icon={Dumbbell01Icon} className="size-5" strokeWidth={2} />
              </span>
              GearUp
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Rent sports and outdoor gear on demand. Find gear, book dates, and pay securely — all
              in one place.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-4 text-primary" strokeWidth={2} />
                support@gearup.com
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={CallIcon} className="size-4 text-primary" strokeWidth={2} />
                +880 1700-000000
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                >
                  <HugeiconsIcon icon={social.icon} className="size-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Account</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {user ? (
                <li>
                  <Link
                    href={ROLE_HOME[user.role]}
                    className="group relative inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                  >
                    <HugeiconsIcon icon={DashboardSquare01Icon} className="size-4 text-primary" strokeWidth={2} />
                    <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    My Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="group relative inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                    >
                      <HugeiconsIcon icon={Login03Icon} className="size-4 text-primary" strokeWidth={2} />
                      <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="group relative inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                    >
                      <HugeiconsIcon icon={Login03Icon} className="size-4 text-primary" strokeWidth={2} />
                      <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Browse</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/gear"
                  className="group relative inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                >
                  <HugeiconsIcon icon={GridViewIcon} className="size-4 text-primary" strokeWidth={2} />
                  <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  All gears
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className="group relative inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                >
                  <HugeiconsIcon icon={Home01Icon} className="size-4 text-primary" strokeWidth={2} />
                  <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  Popular categories
                </Link>
              </li>
            </ul>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Never miss a deal
              </p>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="absolute left-3 top-2.5 size-4 text-slate-500"
                    strokeWidth={2}
                  />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-white/10 bg-white/5 pl-9 text-slate-200 placeholder:text-slate-500 focus-visible:border-primary"
                  />
                </div>
                <Button type="submit" size="icon" aria-label="Subscribe">
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={2} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} GearUp. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5">
              Made with
              <span className="text-primary">★</span>
              for renters everywhere
            </p>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} className="size-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}