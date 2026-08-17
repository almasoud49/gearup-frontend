import {
  Home01Icon,
  UserMultipleIcon,
  GridViewIcon,
  CalendarCheckIcon,
  DocumentValidationIcon,
} from '@hugeicons/core-free-icons';
import type { ISidebarItem } from '@/lib/types';

export const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: Home01Icon,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: UserMultipleIcon,
  },
  {
    label: 'Gear',
    href: '/admin/gear',
    icon: GridViewIcon,
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: CalendarCheckIcon,
  },
  {
    label: 'Rentals',
    href: '/admin/rentals',
    icon: DocumentValidationIcon,
  },
];