import { useSyncExternalStore } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SunriseIcon, SunsetIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const THEME_KEY = 'gearup-theme';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getSnapshot(): Theme {
  return readTheme();
}

function getServerSnapshot(): Theme {
  return 'light';
}

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        listeners.forEach((l) => l());
      }}
      className={cn(
        'relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-card text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 active:scale-90',
        className
      )}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      aria-pressed={dark}
    >
      <span
        key={theme}
        className="animate-zoom-in flex items-center justify-center text-primary"
      >
        <HugeiconsIcon
          icon={dark ? SunriseIcon : SunsetIcon}
          className="size-5"
          strokeWidth={2}
        />
      </span>
    </button>
  );
}