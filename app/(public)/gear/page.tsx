'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterIcon, Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import GearCard from '@/app/(public)/_components/gear/GearCard';
import GearCardSkeleton from '@/app/(public)/_components/gear/GearCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllGear, getCategories } from '@/app/(public)/_actions/gearActions';
import type { GearQuery } from '@/lib/gear';

const BRANDS = ['Trek', 'Bowflex', 'Coleman', 'Marmot', 'Lululemon', 'Intex', 'iRocker', 'Osprey', 'Merrell', 'Mountain Pro'];

export default function GearBrowsePage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [brand, setBrand] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const query: GearQuery = {
    limit: 50,
    searchTerm: search || undefined,
    brand: brand === 'all' ? undefined : brand,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: 'pricePerDay',
    sortOrder: sort,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['gear', 'browse', query],
    queryFn: () => getAllGear(query),
  });

  const items = (data?.data ?? []).filter((g) =>
    categoryId === 'all' ? true : g.categoryId === categoryId
  );

  const hasFilters = search || categoryId !== 'all' || brand !== 'all' || maxPrice;

  const clearFilters = () => {
    setSearch('');
    setCategoryId('all');
    setBrand('all');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse gear</h1>
          <p className="mt-1 text-muted-foreground">
            {isLoading ? 'Loading…' : `${items.length} items ready to rent`}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border/60 bg-card p-5 lg:sticky lg:top-20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <HugeiconsIcon icon={FilterIcon} className="size-4" strokeWidth={2} />
                Filters
              </h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" strokeWidth={2} />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="absolute left-3 top-2.5 size-4 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="search"
                    placeholder="Search gear…"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCategoryId('all')}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      categoryId === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/70'
                    }`}
                  >
                    All
                  </button>
                  {categories?.data.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategoryId(c.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        categoryId === c.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                <select
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="all">All brands</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-sm font-medium">
                  Max price / day
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min={1}
                  placeholder="$"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort" className="text-sm font-medium">Sort by price</Label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
                  className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="asc">Lowest first</option>
                  <option value="desc">Highest first</option>
                </select>
              </div>
            </div>
          </aside>

          <div>
            {isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/40 dark:bg-red-500/10">
                <p className="font-medium text-red-700 dark:text-red-400">Failed to load gear.</p>
                <Button className="mt-4" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GearCardSkeleton key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
                <p className="text-muted-foreground">No gear matches your filters.</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((gear) => (
                  <GearCard key={gear.id} gear={gear} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}