'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import GearImage from '@/app/(public)/_components/gear/GearImage';
import { RatingStars } from '@/app/(public)/_components/gear/RatingStars';
import ReviewModal from '@/app/(dashboard)/_components/reviews/ReviewModal';
import { Button } from '@/components/ui/button';
import { deleteReviewAction, getMyReviews } from '@/app/(dashboard)/_actions/rentalActions';
import { useCustomerData } from '@/app/(dashboard)/_components/useDashboardData';
import { useAuthStore } from '@/lib/auth';
import type { RentalOrder, Review } from '@/lib/types';

export default function CustomerReviewsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { orders, isLoading } = useCustomerData();
  const [reviewFor, setReviewFor] = useState<RentalOrder | null>(null);
  const [editFor, setEditFor] = useState<Review | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['my-reviews', user?.id],
    queryFn: () => getMyReviews(user!.id),
    enabled: !!user,
  });

  const myReviews = reviewsData?.data ?? [];
  const pending = orders.filter((o) => o.status === 'RETURNED' && !o.review);

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReviewAction(reviewId);
    if (result.ok) {
      toast.success('Review deleted!');
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    } else {
      toast.error(result.error ?? 'Could not delete review');
    }
    setConfirmingDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">My Reviews</h1>
        <p className="mt-1 text-muted-foreground">Review returned rentals and see what you&apos;ve shared.</p>
      </div>

      {pending.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10">
          <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
            {pending.length} rental{pending.length > 1 ? 's' : ''} awaiting your review
          </h2>
          <div className="mt-3 space-y-2">
            {pending.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/60 px-4 py-3 dark:bg-background/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{order.gearItem?.name ?? 'Gear item'}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmt(order.startDate)} → {fmt(order.endDate)}
                  </p>
                </div>
                <Button size="sm" onClick={() => setReviewFor(order)}>
                  Leave Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {isLoading || reviewsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : myReviews.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
            <p className="text-muted-foreground">You haven&apos;t written any reviews yet.</p>
            <Button asChild className="mt-4">
              <Link href="/gear">Browse gear</Link>
            </Button>
          </div>
        ) : (
          myReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-4">
                {review.gearItem?.images?.[0] && (
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <GearImage gear={review.gearItem} fill sizes="48px" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{review.gearItem?.name ?? 'Gear item'}</p>
                  <p className="text-xs text-muted-foreground">{fmt(review.createdAt)}</p>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              {review.comment && (
                <p className="mt-3 rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                {confirmingDeleteId === review.id ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setConfirmingDeleteId(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(review.id)}
                    >
                      Confirm delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setEditFor(review)}>
                      <HugeiconsIcon icon={Edit02Icon} className="mr-1.5 size-4" strokeWidth={2} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
                      onClick={() => setConfirmingDeleteId(review.id)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="mr-1.5 size-4" strokeWidth={2} />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {reviewFor && (
        <ReviewModal key={reviewFor.id} order={reviewFor} onClose={() => setReviewFor(null)} />
      )}

      {editFor && (
        <ReviewModal
          key={editFor.id}
          order={
            {
              id: editFor.id,
              gearItem: editFor.gearItem,
            } as RentalOrder
          }
          review={{
            id: editFor.id,
            rating: editFor.rating,
            comment: editFor.comment,
          }}
          onClose={() => setEditFor(null)}
        />
      )}
    </div>
  );
}