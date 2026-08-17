const ORDERS_KEY = 'gearup:orders';

export const orderStore = {
  getAllIds: (): string[] => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  },
  addId: (id: string) => {
    const ids = orderStore.getAllIds();
    if (!ids.includes(id)) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify([...ids, id]));
    }
  },
};