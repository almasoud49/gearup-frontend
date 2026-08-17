export default function GearCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
        <div className="mt-auto flex justify-between pt-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}