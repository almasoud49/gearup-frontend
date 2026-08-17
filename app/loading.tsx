import GearCardSkeleton from '@/app/(public)/_components/gear/GearCardSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <GearCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}