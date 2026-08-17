'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import { Button } from '@/components/ui/button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-7" strokeWidth={2} />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your rental has been paid. Track its status in your dashboard.
      </p>
      {paymentIntent && (
        <p className="mt-4 rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          {paymentIntent}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-2">
        <Button asChild size="lg" className="w-full">
          <Link href="/customer">Go to my dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/gear">Continue browsing gear</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}