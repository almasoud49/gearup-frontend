'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import GearForm from '@/app/(dashboard)/_components/gear/GearForm';
import { getGearById } from '@/app/(public)/_actions/gearActions';
import { Button } from '@/components/ui/button';

export default function EditGearPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['gear', id],
    queryFn: () => getGearById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  const gear = data?.data ?? null;

  if (!gear) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-10 text-center">
        <p className="text-muted-foreground">Could not load this gear item.</p>
        <Button asChild className="mt-4">
          <Link href="/provider/gear">Back to My Gear</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Gear</h1>
      <p className="mt-1 text-muted-foreground">Update the details of “{gear.name}”.</p>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <GearForm initial={gear} onDone={() => router.push('/provider/gear')} />
      </div>
    </div>
  );
}