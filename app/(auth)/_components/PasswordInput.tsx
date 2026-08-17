'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { ViewIcon, EyeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function PasswordInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pl-10 pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <HugeiconsIcon icon={visible ? EyeIcon : ViewIcon} className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}