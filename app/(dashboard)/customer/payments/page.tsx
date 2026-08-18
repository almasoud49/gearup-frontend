'use client';

import { useCustomerData } from '@/app/(dashboard)/_components/useDashboardData';
import ErrorState from '@/app/(dashboard)/_components/ErrorState';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet01Icon } from '@hugeicons/core-free-icons';

export default function CustomerPaymentsPage() {
  const { payments, isLoading, isError, refetch } = useCustomerData();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Customer Dashboard · Payments
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Payment History</h1>
      <p className="mt-1 text-muted-foreground">All transactions across your rentals.</p>

      {isError ? (
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      ) : (
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">Transaction</th>
                <th className="px-4 py-3.5 font-semibold">Item</th>
                <th className="px-4 py-3.5 font-semibold">Amount</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && payments.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={Wallet01Icon} className="size-6" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">No payments yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Payments will appear here once you book a rental.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4 font-mono text-xs">{p.transactionId.slice(0, 18)}…</td>
                    <td className="px-4 py-4">{p.rentalOrder?.gearItem?.name ?? '—'}</td>
                    <td className="px-4 py-4 font-semibold tabular-nums">${Number(p.amount).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                        {p.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}