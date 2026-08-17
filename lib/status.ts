import type { RentalStatus } from '@/lib/types';

export const STATUS_META: Record<
  RentalStatus,
  { label: string; badge: string; dot: string }
> = {
  PLACED: {
    label: 'Placed',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  CONFIRMED: {
    label: 'Confirmed',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  PAID: {
    label: 'Paid',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
    dot: 'bg-purple-500',
  },
  PICKED_UP: {
    label: 'Picked Up',
    badge: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    dot: 'bg-green-500',
  },
  RETURNED: {
    label: 'Returned',
    badge: 'bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground',
    dot: 'bg-gray-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

export function getStatusMeta(status: RentalStatus) {
  return STATUS_META[status] ?? STATUS_META.PLACED;
}