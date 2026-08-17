import type { ISidebarItem } from '@/lib/types';
import { CUSTOMER_SIDEBAR_ITEMS } from './customerSidebarItems';
import { PROVIDER_SIDEBAR_ITEMS } from './providerSidebarItems';
import { ADMIN_SIDEBAR_ITEMS } from './adminSidebarItems';

export const sidebarMenuItems: Record<string, ISidebarItem[]> = {
  CUSTOMER: CUSTOMER_SIDEBAR_ITEMS,
  PROVIDER: PROVIDER_SIDEBAR_ITEMS,
  ADMIN: ADMIN_SIDEBAR_ITEMS,
};