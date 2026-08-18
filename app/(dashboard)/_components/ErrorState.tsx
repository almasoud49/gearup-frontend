'use client';

import { Refresh01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';

export default function ErrorState({
  title = 'Could not load your data',
  message = 'Something went wrong while fetching your data. Please try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <HugeiconsIcon icon={Refresh01Icon} className="size-6" strokeWidth={2} />
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <HugeiconsIcon icon={Refresh01Icon} className="size-4" strokeWidth={2} />
          Try again
        </Button>
      )}
    </div>
  );
}