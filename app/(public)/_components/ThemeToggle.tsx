import { useSyncExternalStore } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Moon01Icon, Sun02Icon } from '@hugeicons/core-free-icons';

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

  return (
    <button
      type="button"
      onClick={() => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        listeners.forEach((l) => l());
      }}
      className={`flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-muted ${className ?? ''}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <HugeiconsIcon
        icon={theme === 'dark' ? Sun02Icon : Moon01Icon}
        className="size-5"
        strokeWidth={2}
      />
    </button>
  );
}