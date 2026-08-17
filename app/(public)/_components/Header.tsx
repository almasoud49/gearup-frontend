'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dumbbell01Icon,
  Logout02Icon,
  DashboardSquare01Icon,
  UserIcon,
  Menu01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ROLE_HOME, useAuthStore } from '@/lib/auth';
import { logout as serverLogout } from '@/service/logout';
import ThemeToggle from '@/app/(public)/_components/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Gears', href: '/gear' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: 'Customer',
  PROVIDER: 'Provider',
  ADMIN: 'Admin',
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const [open, setOpen] = useState(false);

  const home = user ? ROLE_HOME[user.role] : '/';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    await serverLogout();
    storeLogout();
    toast.success('Logged out successfully!');
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HugeiconsIcon icon={Dumbbell01Icon} className="size-5" strokeWidth={2} />
          </span>
          GearUp
        </Link>

        {/* Centered nav links */}
        <div className="hidden items-center gap-1 rounded-full bg-muted/60 p-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-muted hover:text-primary'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="md:mr-1" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            <HugeiconsIcon
              icon={open ? Cancel01Icon : Menu01Icon}
              className="size-5"
              strokeWidth={2}
            />
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary/10 transition hover:bg-primary/20"
                  aria-label="Account menu"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-4 text-primary" strokeWidth={2} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(home)}>
                  <HugeiconsIcon
                    icon={DashboardSquare01Icon}
                    className="mr-2 size-4"
                    strokeWidth={2}
                  />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <HugeiconsIcon icon={Logout02Icon} className="mr-2 size-4" strokeWidth={2} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/register">Register</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="animate-fade-in border-t border-border/60 bg-card px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-4">
              <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="flex-1" onClick={() => setOpen(false)}>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}