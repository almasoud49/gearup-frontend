'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveGearAction } from '@/app/(dashboard)/_actions/gearActions';
import { getCategories } from '@/app/(public)/_actions/gearActions';
import { DEFAULT_GEAR_PAYLOAD, type GearPayload } from '@/lib/gear';
import type { GearItem } from '@/lib/types';

interface FormState {
  images: string;
  specifications: string;
  categoryId: string;
}

export default function GearForm({
  initial,
  onDone,
}: {
  initial: GearItem | null;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<GearPayload>(() =>
    initial
      ? {
          name: initial.name,
          description: initial.description,
          pricePerDay: initial.pricePerDay,
          brand: initial.brand,
          stockQuantity: initial.stockQuantity,
          availability: initial.availability,
          images: initial.images,
          categoryId: initial.categoryId,
          specifications: Object.fromEntries(
            Object.entries(initial.specifications ?? {}).map(([k, v]) => [k, String(v)])
          ),
        }
      : DEFAULT_GEAR_PAYLOAD
  );
  const [extra, setExtra] = useState<FormState>({
    images: (initial?.images ?? []).join(', '),
    specifications: Object.entries(initial?.specifications ?? {})
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join('\n'),
    categoryId: initial?.categoryId ?? '',
  });
  const [saving, setSaving] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: () =>
      saveGearAction({
        id: initial?.id,
        form,
        imagesText: extra.images,
        specificationsText: extra.specifications,
        categoryId: extra.categoryId,
      }),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to save gear');
        return;
      }
      toast.success(initial ? 'Gear updated!' : 'Gear added!');
      await queryClient.invalidateQueries({ queryKey: ['gear'] });
      onDone();
    },
    onError: () => toast.error('Failed to save gear'),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await mutation.mutateAsync();
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof GearPayload>(key: K, value: GearPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" required value={form.brand} onChange={(e) => set('brand', e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          required
          rows={2}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="pricePerDay">Price / day ($)</Label>
          <Input
            id="pricePerDay"
            type="number"
            min={1}
            step={0.01}
            required
            value={form.pricePerDay}
            onChange={(e) => set('pricePerDay', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stockQuantity">Stock</Label>
          <Input
            id="stockQuantity"
            type="number"
            min={0}
            required
            value={form.stockQuantity}
            onChange={(e) => set('stockQuantity', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            required
            value={extra.categoryId}
            onChange={(e) => setExtra((p) => ({ ...p, categoryId: e.target.value }))}
            className="h-10 w-full rounded-xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">Select category</option>
            {categories?.data.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="images">Image URLs (comma separated)</Label>
        <Input
          id="images"
          value={extra.images}
          onChange={(e) => setExtra((p) => ({ ...p, images: e.target.value }))}
          placeholder="https://example.com/image.jpg, https://…"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="specifications">
          Specifications (one per line, `key: value`)
        </Label>
        <textarea
          id="specifications"
          rows={3}
          value={extra.specifications}
          onChange={(e) => setExtra((p) => ({ ...p, specifications: e.target.value }))}
          placeholder={'frame: Aluminum\nwheels: 29 inch'}
          className="w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.availability}
          onChange={(e) => set('availability', e.target.checked)}
          className="size-4 accent-[var(--primary)]"
        />
        Available for rent
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Gear'}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}