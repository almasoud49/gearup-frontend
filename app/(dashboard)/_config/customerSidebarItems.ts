import {
  Home01Icon,
  CalendarCheckIcon,
  CreditCardIcon,
  ProfileIcon,
  StarIcon,
} from '@hugeicons/core-free-icons';
import type { ISidebarItem } from '@/lib/types';

export const CUSTOMER_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: 'Overview',
    href: '/customer',
    icon: Home01Icon,
  },
  {
    label: 'My Orders',
    href: '/customer/orders',
    icon: CalendarCheckIcon,
  },
  {
    label: 'Payments',
    href: '/customer/payments',
    icon: CreditCardIcon,
  },
  {
    label: 'My Reviews',
    href: '/customer/reviews',
    icon: StarIcon,
  },
  {
    label: 'Profile',
    href: '/customer/profile',
    icon: ProfileIcon,
  },
];