'use client';

import Link from 'next/link';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <HugeiconsIcon icon={Cancel01Icon} className="size-7" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment canceled</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You were not charged. Your rental order is still active — you can pay any time from
            your dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/customer">Go to my dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/gear">Continue browsing gear</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}