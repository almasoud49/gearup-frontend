'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripePaymentElementOptions } from '@stripe/stripe-js';
import { CreditCardIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';

const paymentElementOptions: StripePaymentElementOptions = {
  layout: {
    type: 'accordion',
    defaultCollapsed: false,
    spacedAccordionItems: true,
  },
};

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const readyRef = useRef(false);

  const handleReady = () => {
    setLoadError(null);
    setMessage(null);
    readyRef.current = true;
    setReady(true);
  };

  const handleLoadError = (event: { error: { message?: string; code?: string } }) => {
    setLoadError(event.error?.message ?? 'payment_form_load_error');
    readyRef.current = false;
    setReady(false);
    setMessage(
      'The payment form could not load. This usually means the payment link is invalid or expired — please go back and start the payment again.'
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Elements can't be submitted until the Payment Element has actually mounted.
    if (!stripe || !elements || !readyRef.current || loadError) {
      setMessage('Payment form is still loading — please wait a moment and try again.');
      return;
    }

    setProcessing(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setMessage(error.message ?? 'Payment failed. Please try again.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!ready && !loadError && (
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          Loading secure payment form…
        </div>
      )}
      <PaymentElement
        options={paymentElementOptions}
        onReady={handleReady}
        onLoadError={handleLoadError}
      />
      {message && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{message}</p>
      )}
      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          disabled={!stripe || !elements || !ready || !!loadError || processing}
          size="lg"
          className="w-full"
        >
          {processing ? (
            'Processing…'
          ) : (
            <>
              <HugeiconsIcon icon={CreditCardIcon} className="size-4" strokeWidth={2} />
              Pay now
            </>
          )}
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/payment/cancel">Cancel payment</Link>
        </Button>
      </div>
    </form>
  );
}