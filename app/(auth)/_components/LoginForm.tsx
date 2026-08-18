'use client';

import { useActionState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { Login03Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/app/(auth)/_components/PasswordInput';

import { loginAction, type LoginState } from '@/app/(auth)/_actions/authActions';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '';

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction.bind(null, redirectTo),
    { success: false }
  );

  useEffect(() => {
    if (!state || state.success) return;
    if (state.form) toast.error(state.form);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
          <HugeiconsIcon icon={Login03Icon} className="size-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your GearUp account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!state.success && !!state.email}
            aria-describedby={!state.success && state.email ? 'email-error' : undefined}
            className={`h-11 pl-10 transition-shadow focus-visible:ring-primary ${!state.success && state.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
        </div>
        {!state.success && state.email && (
          <p id="email-error" className="text-sm text-red-500 dark:text-red-400">{state.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          placeholder="••••••••"
          aria-invalid={!state.success && !!state.password}
          aria-describedby={!state.success && state.password ? 'password-error' : undefined}
          className={!state.success && state.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {!state.success && state.password && (
          <p id="password-error" className="text-sm text-red-500 dark:text-red-400">{state.password}</p>
        )}
      </div>

      {!state.success && state.form && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {state.form}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="group h-11 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-600/35"
      >
        {isPending ? (
          'Signing in...'
        ) : (
          <>
            Sign in
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </>
        )}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition dark:text-indigo-400 dark:hover:text-indigo-300">
          Sign Up
        </Link>
      </p>
    </form>
  );
}