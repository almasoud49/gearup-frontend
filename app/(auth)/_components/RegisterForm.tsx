'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, UserCog } from 'lucide-react';
import { UserAddIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/app/(auth)/_components/PasswordInput';

import { registerAction, type RegisterState } from '@/app/(auth)/_actions/authActions';

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    registerAction,
    { success: false }
  );

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success('Registration successful! Please login.');
      router.push('/login?registered=true');
      return;
    }

    if (state.form) toast.error(state.form);
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
          <HugeiconsIcon icon={UserAddIcon} className="size-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Join GearUp and start renting
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            aria-invalid={!state.success && !!state.name}
            aria-describedby={!state.success && state.name ? 'name-error' : undefined}
            className={`h-11 pl-10 transition-shadow focus-visible:ring-primary ${!state.success && state.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
        </div>
        {!state.success && state.name && (
          <p id="name-error" className="text-sm text-red-500 dark:text-red-400">{state.name}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="At least 6 characters"
          aria-invalid={!state.success && !!state.password}
          aria-describedby={!state.success && state.password ? 'password-error' : undefined}
          className={!state.success && state.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {!state.success && state.password && (
          <p id="password-error" className="text-sm text-red-500 dark:text-red-400">{state.password}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium">I want to</Label>
        <div className="relative">
          <UserCog className="absolute left-3.5 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <input type="hidden" name="role" value={role} />
          <Select value={role} onValueChange={(v) => setRole(v as 'CUSTOMER' | 'PROVIDER')}>
            <SelectTrigger
              id="role"
              className={`h-11 w-full pl-10 transition-shadow focus-visible:ring-primary ${!state.success && state.role ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Rent gear (Customer)</SelectItem>
              <SelectItem value="PROVIDER">List my gear (Provider)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!state.success && state.role && <p className="text-sm text-red-500 dark:text-red-400">{state.role}</p>}
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
          'Creating account...'
        ) : (
          <>
            Create Account
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </>
        )}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition dark:text-indigo-400 dark:hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}