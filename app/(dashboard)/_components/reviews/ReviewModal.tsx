'use client';

import { useActionState, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  createReviewAction,
  updateReviewAction,
  type ReviewActionState,
} from '@/app/(dashboard)/_actions/rentalActions';
import type { RentalOrder } from '@/lib/types';

type EditableReview = {
  id: string;
  rating: number;
  comment?: string;
};

export default function ReviewModal({
  order,
  review,
  onClose,
}: {
  order: RentalOrder;
  review?: EditableReview;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(review?.rating ?? 5);

  const action = review
    ? updateReviewAction.bind(null, review.id)
    : createReviewAction.bind(null, order.gearItemId);

  const [state, formAction, isPending] = useActionState<ReviewActionState, FormData>(action, {
    error: null,
  });

  useEffect(() => {
    if (!state) return;

    if (state.submitted) {
      toast.success(review ? 'Review updated!' : 'Review submitted!');
      onClose();
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, onClose, queryClient, review]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form action={formAction} className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{review ? 'Edit your review' : 'Review this gear'}</h3>
            <p className="text-sm text-muted-foreground">{order.gearItem?.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <span className="text-sm font-medium">Rating</span>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className="text-2xl"
                  aria-label={`${i} star${i > 1 ? 's' : ''}`}
                >
                  <HugeiconsIcon
                    icon={StarIcon}
                    className={`size-6 ${
                      i <= rating ? 'text-amber-500' : 'text-muted-foreground/40'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment">Comment</Label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              defaultValue={review?.comment ?? ''}
              placeholder="How was the gear?"
              className="w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <input type="hidden" name="rating" value={rating} />

        {state.error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? 'Saving…' : review ? 'Save Changes' : 'Submit Review'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}