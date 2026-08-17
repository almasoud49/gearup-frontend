'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { LockIcon, Wallet01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';

import { CheckoutForm } from '@/app/(public)/_components/payment/CheckoutForm';
import Header from '@/app/(public)/_components/Header';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/app/(public)/_components/orders/StatusBadge';
import { createPaymentIntent, getRentalById } from '@/app/(public)/_actions/rentalActions';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function PaymentPage() {
  const { rentalId } = useParams<{ rentalId: string }>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['rental', rentalId],
    queryFn: () => getRentalById(rentalId),
    retry: 0,
  });

  const order = data?.data;

  const stripeReady =
    !!publishableKey && !publishableKey.includes('your_') && !publishableKey.includes('pk_live_your');

  const stripePromise = useMemo(
    () => (stripeReady ? loadStripe(publishableKey ?? '') : null),
    [stripeReady]
  );

  const handleStartPayment = async () => {
    if (!order) return;
    setStarting(true);
    setError(null);
    try {
      const response = await createPaymentIntent(order.id);
      if (response.success && response.data?.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        setError(response.message || 'Could not start payment. Please try again.');
      }
    } catch {
      setError('Could not start payment. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={LockIcon} className="size-7" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold">Secure Payment</h1>

          {isLoading && (
            <p className="mt-4 text-center text-sm text-muted-foreground">Loading order…</p>
          )}

          {!isLoading && !order && (
            <div className="mt-6">
              <p className="text-center text-sm text-muted-foreground">
                We couldn&apos;t find this rental order.
              </p>
              <Button asChild className="mt-4 w-full" variant="outline">
                <Link href="/customer">Back to dashboard</Link>
              </Button>
            </div>
          )}

          {!isLoading && order && order.status === 'PAID' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">This order has already been paid.</p>
              <Button asChild className="mt-4 w-full">
                <Link href="/customer">View my orders</Link>
              </Button>
            </div>
          )}

          {!isLoading && order && order.status !== 'PAID' && (
            <>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
                <span className="font-medium">{order.gearItem?.name ?? 'Rental order'}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {formatDate(order.startDate)} → {formatDate(order.endDate)}
                </span>
                <span className="font-mono text-xs">{order.id.slice(0, 10)}…</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <HugeiconsIcon icon={Wallet01Icon} className="size-4" strokeWidth={2} />
                  Amount due
                </span>
                <span className="text-2xl font-bold">${Number(order.totalPrice).toFixed(2)}</span>
              </div>

              {!stripeReady && (
                <div className="mt-6">
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    Stripe is not configured yet — set{' '}
                    <span className="font-mono text-xs">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span> in
                    your <span className="font-mono text-xs">.env</span> to accept payments.
                  </p>
                  <Button asChild variant="outline" className="mt-4 w-full">
<Link href="/customer">Back to dashboard</Link>
                  </Button>
                </div>
              )}

              {stripeReady && !clientSecret && (
                <div className="mt-6 flex flex-col gap-2">
                  {error && (
                    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <Button
                    onClick={handleStartPayment}
                    disabled={starting}
                    size="lg"
                    className="w-full"
                  >
                    {starting ? 'Preparing payment…' : 'Start secure payment'}
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/payment/cancel">Cancel</Link>
                  </Button>
                </div>
              )}

              {stripeReady && clientSecret && (
                <div className="mt-6">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                  </Elements>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}