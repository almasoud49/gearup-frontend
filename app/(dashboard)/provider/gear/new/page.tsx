'use client';

import { useRouter } from 'next/navigation';

import GearForm from '@/app/(dashboard)/_components/gear/GearForm';

export default function NewGearPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Add New Gear</h1>
      <p className="mt-1 text-muted-foreground">List a new item on the platform for rent.</p>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <GearForm initial={null} onDone={() => router.push('/provider/gear')} />
      </div>
    </div>
  );
}