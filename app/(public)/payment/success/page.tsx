'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CheckmarkCircle02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import { Button } from '@/components/ui/button';
import { confirmPaymentAction } from '@/app/(public)/_actions/rentalActions';

type ConfirmState = 'pending' | 'done' | 'error' | 'neutral';

function SuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const paymentIntent = searchParams.get('payment_intent');

  const [state, setState] = useState<ConfirmState>(
    paymentIntent ? 'pending' : 'neutral'
  );
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntent) return;
    let active = true;

    const run = async () => {
      try {
        const result = await confirmPaymentAction(paymentIntent);
        if (!active) return;
        if (result.ok) {
          await queryClient.invalidateQueries({ queryKey: ['payments'] });
          await queryClient.invalidateQueries({ queryKey: ['rentals'] });
          await queryClient.invalidateQueries({ queryKey: ['rental-stats'] });
          setState('done');
        } else {
          setConfirmError(result.error ?? 'Could not confirm your payment.');
          setState('error');
        }
      } catch {
        if (!active) return;
        setConfirmError('Could not confirm your payment.');
        setState('error');
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [paymentIntent, queryClient]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
      {state === 'pending' ? (
        <>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <span className="size-7 animate-spin rounded-full border-[3px] border-muted-foreground/30 border-t-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Confirming payment…</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Syncing your payment with your orders. This should only take a moment.
          </p>
        </>
      ) : state === 'error' ? (
        <>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <HugeiconsIcon icon={Cancel01Icon} className="size-7" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment received, confirmation pending</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your payment went through. We couldn&apos;t automatically mark the order as paid.
          </p>
          {confirmError && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
              {confirmError}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/customer/orders">View my orders</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/payment/cancel">Back</Link>
            </Button>
          </div>
        </>
      ) : state === 'neutral' ? (
        <>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-7" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment page</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No payment reference was provided. If you just paid, check your orders to confirm the
            status.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/customer/orders">View my orders</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/gear">Continue browsing gear</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-7" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your rental has been paid and marked PAID in your orders.
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
        </>
      )}
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