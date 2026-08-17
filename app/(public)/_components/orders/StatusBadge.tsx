import type { RentalStatus } from '@/lib/types';
import { getStatusMeta } from '@/lib/status';

export default function StatusBadge({ status }: { status: RentalStatus }) {
  const meta = getStatusMeta(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}