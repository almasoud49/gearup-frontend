import { Home01Icon, GridViewIcon, CalendarCheckIcon } from '@hugeicons/core-free-icons';
import type { ISidebarItem } from '@/lib/types';

export const PROVIDER_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: 'Overview',
    href: '/provider',
    icon: Home01Icon,
  },
  {
    label: 'My Gear',
    href: '/provider/gear',
    icon: GridViewIcon,
  },
  {
    label: 'Orders',
    href: '/provider/orders',
    icon: CalendarCheckIcon,
  },
];