import Link from 'next/link';
import { Dumbbell01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import AuroraBackground from './AuroraBackground';

export default function AuthShell({
  banner,
  children,
}: {
  banner?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <AuroraBackground />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="group mx-auto mb-6 flex w-fit items-center gap-2 text-lg font-bold"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
            <HugeiconsIcon icon={Dumbbell01Icon} className="size-5" strokeWidth={2} />
          </span>
          GearUp
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/80 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl sm:p-10 dark:border-white/10 dark:bg-card/80 dark:shadow-black/40">
          {/* top accent bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-fuchsia-500" />

          {banner && <div className="mb-6">{banner}</div>}
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GearUp · Rent gear, own the adventure.
        </p>
      </div>
    </div>
  );
}