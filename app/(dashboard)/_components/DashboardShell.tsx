'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dumbbell01Icon, Logout02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';

import { useAuthStore, type UserRole } from '@/lib/auth';
import type { ISidebarItem } from '@/lib/types';
import { sidebarMenuItems } from '@/app/(dashboard)/_config/sidebarMenuItems';
import { logout } from '@/service/logout';

const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: 'Customer',
  PROVIDER: 'Provider',
  ADMIN: 'Admin',
};

export default function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  // proxy.ts guarantees the route prefix matches the session role, so the
  // sidebar is always role-correct from first render (no hydration dependency).
  const role: UserRole = pathname.startsWith('/admin')
    ? 'ADMIN'
    : pathname.startsWith('/provider')
      ? 'PROVIDER'
      : 'CUSTOMER';
  const nav: ISidebarItem[] = sidebarMenuItems[role] ?? sidebarMenuItems.CUSTOMER;

  const handleLogout = async () => {
    await logout();
    storeLogout();
    router.push('/login');
  };

  const isActive = (item: ISidebarItem) => {
    const depth = item.href.split('/').filter(Boolean).length;
    if (depth === 2) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-card lg:flex">
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-border/60 px-5 font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HugeiconsIcon icon={Dumbbell01Icon} className="size-4" strokeWidth={2} />
          </span>
          GearUp
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(item)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <HugeiconsIcon icon={item.icon} className="size-4" strokeWidth={2} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() ?? role.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? ROLE_LABEL[role]}</p>
              <p className="truncate text-xs text-muted-foreground">{ROLE_LABEL[role]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <HugeiconsIcon icon={Logout02Icon} className="size-4" strokeWidth={2} />
              <span className="hidden xl:inline">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border/60 bg-card px-4 lg:hidden">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={Dumbbell01Icon} className="size-4" strokeWidth={2} />
            </span>
            GearUp
          </button>
          <div className="ml-auto flex items-center gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  isActive(item) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={Logout02Icon} className="size-4" strokeWidth={2} />
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}