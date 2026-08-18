'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CART_KEY = 'gearup:cart';

export interface CartItem {
  gearId: string;
  startDate: string;
  endDate: string;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (gearId: string) => void;
  clear: () => void;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.gearId === item.gearId)
            ? state.items.map((i) => (i.gearId === item.gearId ? item : i))
            : [...state.items, item],
        })),
      remove: (gearId) =>
        set((state) => ({ items: state.items.filter((i) => i.gearId !== gearId) })),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    { name: CART_KEY }
  )
);