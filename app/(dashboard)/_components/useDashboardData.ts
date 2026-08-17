'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { orderStore } from '@/lib/orderStore';
import { useAuthStore } from '@/lib/auth';
import { getAllGear } from '@/app/(public)/_actions/gearActions';
import { getMyPayments, getProviderStats, getRentals } from '@/app/(dashboard)/_actions/rentalActions';
import { getRentalById, getRentalStatsOverview } from '@/app/(public)/_actions/rentalActions';
import { getAdminStats, getAdminUsers } from '@/app/(dashboard)/_actions/userActions';
import type { AdminStats, ApiResponse, ProviderStats, RentalOrder, RentalStatsOverview, User } from '@/lib/types';

function getUsersArray(data: { data: unknown }): User[] {
  const d = data.data;
  if (Array.isArray(d)) return d as User[];
  if (d && typeof d === 'object' && 'users' in d) return (d as { users: User[] }).users;
  return [];
}

export function useCustomerData() {
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getMyPayments,
  });

  const payments = useMemo(() => paymentsData?.data ?? [], [paymentsData]);
  const knownOrderIds = useMemo(
    () => new Set(payments.map((p) => p.rentalOrderId).filter(Boolean)),
    [payments]
  );

  const { data: localOrders, isLoading: localLoading } = useQuery({
    queryKey: ['rentals', 'local'],
    queryFn: async () => {
      const ids = orderStore.getAllIds().filter((id) => !knownOrderIds.has(id));
      if (ids.length === 0) return [] as RentalOrder[];
      const results = await Promise.allSettled(ids.map((id) => getRentalById(id)));
      return results
        .filter(
          (r): r is PromiseFulfilledResult<ApiResponse<RentalOrder>> => r.status === 'fulfilled'
        )
        .map((r) => r.value.data);
    },
  });

  const orders = useMemo(() => {
    const fromPayments = payments
      .map((p) => p.rentalOrder)
      .filter((o): o is RentalOrder => !!o)
      .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
    const merged = [...(localOrders ?? []), ...fromPayments];
    return merged.filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
  }, [payments, localOrders]);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['rental-stats'],
    queryFn: getRentalStatsOverview,
  });

  const totalSpent = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const activeOrders = orders.filter((o) =>
    ['PLACED', 'CONFIRMED', 'PAID', 'PICKED_UP'].includes(o.status)
  ).length;
  const pendingReviews = orders.filter((o) => o.status === 'RETURNED' && !o.review);
  const stats: RentalStatsOverview | undefined = statsData?.data;

  return {
    payments,
    orders,
    totalSpent,
    activeOrders,
    pendingReviews,
    stats,
    isLoading: paymentsLoading || localLoading,
    statsLoading,
  };
}

export function useProviderData() {
  const user = useAuthStore((state) => state.user);

  const { data: gearData, isLoading: gearLoading } = useQuery({
    queryKey: ['gear'],
    queryFn: () => getAllGear({ limit: 100 }),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['rentals'],
    queryFn: () => getRentals({ limit: 100 }),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['provider-stats'],
    queryFn: getProviderStats,
  });

  const myGear = useMemo(
    () => (gearData?.data ?? []).filter((g) => g.providerId === user?.id),
    [gearData, user]
  );

  const myOrders = useMemo(() => {
    const all = ordersData?.data ?? [];
    if (!user) return all;
    const ownGearIds = new Set(myGear.map((g) => g.id));
    const own = all.filter((o) => ownGearIds.has(o.gearItemId));
    return own.length > 0 ? own : all;
  }, [ordersData, myGear, user]);

  const pending = myOrders.filter((o) => ['PLACED', 'CONFIRMED'].includes(o.status)).length;
  const stats: ProviderStats | undefined = statsData?.data;

  return {
    user,
    myGear,
    myOrders,
    pending,
    stats,
    gearLoading,
    ordersLoading,
    statsLoading,
  };
}

export function useAdminData() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  });
  const { data: gearData, isLoading: gearLoading } = useQuery({
    queryKey: ['gear'],
    queryFn: () => getAllGear({ limit: 100 }),
  });
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['rentals'],
    queryFn: () => getRentals({ limit: 100 }),
  });
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });

  const users = useMemo(() => getUsersArray({ data: usersData }) as User[], [usersData]);
  const gear = gearData?.data ?? [];
  const orders = ordersData?.data ?? [];
  const stats: AdminStats | undefined = statsData?.data;

  return { users, gear, orders, stats, usersLoading, gearLoading, ordersLoading, statsLoading };
}