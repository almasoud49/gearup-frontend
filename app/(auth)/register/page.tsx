import { Suspense } from 'react';
import AuthShell from '../_components/AuthShell';
import RegisterForm from '../_components/RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { registered } = await searchParams;

  return (
    <AuthShell
      banner={
        registered ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-400">
            Account created! Please sign in to continue.
          </div>
        ) : undefined
      }
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}