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
        <div className="rounded-[2rem] border border-white/40 bg-white/70 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl sm:p-10 dark:border-white/10 dark:bg-card/40 dark:shadow-black/40">
          {banner && <div className="mb-6">{banner}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}