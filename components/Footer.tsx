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
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SOCIALS = [
  { icon: Facebook01Icon, label: 'Facebook', href: 'https://facebook.com' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
  { icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin01Icon, label: 'LinkedIn', href: 'https://linkedin.com' },
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
    <footer className="relative overflow-hidden bg-indigo-950 text-indigo-100">
      {/* thin brand accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-400 to-fuchsia-500" />
      {/* indigo depth overlay + orbs, matching the page heroes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-950/90 to-indigo-950" />
      <div className="animate-float pointer-events-none absolute -right-24 top-1/3 size-96 rounded-full bg-sky-400/20 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute -left-28 bottom-10 size-80 rounded-full bg-fuchsia-600/20 blur-3xl mix-blend-screen" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* CTA banner — clear hierarchy, generous whitespace */}
        <div className="py-16">
          <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-10 sm:px-12 backdrop-blur-sm">
            <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/30 blur-3xl mix-blend-screen" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full bg-fuchsia-600/20 blur-3xl mix-blend-screen" />
            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Ready for your next adventure?
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Join thousands of renters &amp; providers.
                </h3>
                <p className="mt-2 text-sm text-indigo-200/80">
                  Rent gear by the day — or list your own and start earning today.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-indigo-950 shadow-lg shadow-white/10 transition-all duration-200 hover:bg-indigo-50 hover:shadow-white/20"
                >
                  <Link href="/register">Get started</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white transition-all duration-200 hover:border-primary hover:bg-primary/20"
                >
                  <Link href="/gear">Browse gears</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Link columns — aligned grid, consistent spacing */}
        <div className="grid gap-12 py-12 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group flex w-fit items-center gap-2 text-lg font-bold text-white"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                <HugeiconsIcon icon={Dumbbell01Icon} className="size-5" strokeWidth={2} />
              </span>
              GearUp
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-indigo-200/80">
              Rent sports and outdoor gear on demand. Find gear, book dates, and pay securely — all
              in one place.
            </p>
            <div className="mt-5 space-y-2 text-sm text-indigo-200/80">
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
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-indigo-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white active:scale-90"
                >
                  <HugeiconsIcon icon={social.icon} className="size-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-flex items-center gap-1.5 text-indigo-200/80 transition-colors hover:text-white"
                  >
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Account</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {user ? (
                <li>
                  <Link
                    href={ROLE_HOME[user.role]}
                    className="group relative inline-flex items-center gap-1.5 text-indigo-200/80 transition-colors hover:text-white"
                  >
                    <HugeiconsIcon
                      icon={DashboardSquare01Icon}
                      className="size-4 text-primary"
                      strokeWidth={2}
                    />
                    <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    My Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="group relative inline-flex items-center gap-1.5 text-indigo-200/80 transition-colors hover:text-white"
                    >
                      <HugeiconsIcon
                        icon={Login03Icon}
                        className="size-4 text-primary"
                        strokeWidth={2}
                      />
                      <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="group relative inline-flex items-center gap-1.5 text-indigo-200/80 transition-colors hover:text-white"
                    >
                      <HugeiconsIcon
                        icon={Login03Icon}
                        className="size-4 text-primary"
                        strokeWidth={2}
                      />
                      <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Browse + newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Browse</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/gear"
                  className="group relative inline-flex items-center gap-1.5 text-indigo-200/80 transition-colors hover:text-white"
                >
                  <HugeiconsIcon
                    icon={GridViewIcon}
                    className="size-4 text-primary"
                    strokeWidth={2}
                  />
                  <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  All gears
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className="group relative inline-flex items-center gap-1.5 text-indigo-200/80 transition-colors hover:text-white"
                >
                  <HugeiconsIcon
                    icon={Home01Icon}
                    className="size-4 text-primary"
                    strokeWidth={2}
                  />
                  <span className="absolute -bottom-0.5 left-6 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  Popular categories
                </Link>
              </li>
            </ul>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-300/70">
                Never miss a deal
              </p>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="absolute left-3 top-2.5 size-4 text-indigo-300/70"
                    strokeWidth={2}
                  />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-white/10 bg-white/5 pl-9 text-indigo-50 transition-all duration-200 placeholder:text-indigo-300/70 hover:border-white/20 focus-visible:border-primary focus-visible:ring-primary/40"
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
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-xs text-indigo-300/70 sm:flex-row">
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
              className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-indigo-200/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary active:scale-90"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} className="size-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}