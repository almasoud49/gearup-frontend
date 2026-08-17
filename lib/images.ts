export const CURATED_IMAGES: Record<string, string> = {
  Camping: 'photo-1504280390367-361c6d9f38f4',
  'Climbing & Mountaineering': 'photo-1464822759023-fed622ff2c3b',
  Cycling: 'photo-1485965120184-e220f721d03e',
  Fitness: 'photo-1535131749006-b7f58c99034b',
  Golf: 'photo-1554068865-24cecd4e34b8',
  Hiking: 'photo-1551632811-561732d1e306',
  'Racket Sports': 'photo-1622279457486-62dcc4a431d6',
  'Running & Jogging': 'photo-1461896836934-ffe607ba8211',
  'Water Sports': 'photo-1502680390469-be75c86b636f',
};

export const HERO_IMAGE = 'photo-1464822759023-fed622ff2c3b';

export function unsplashUrl(id: string, w = 1200): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export function categoryImage(name?: string): string | undefined {
  if (!name) return undefined;
  const exact = CURATED_IMAGES[name];
  if (exact) return unsplashUrl(exact);
  const key = Object.keys(CURATED_IMAGES).find(
    (k) => name.toLowerCase().includes(k.toLowerCase())
  );
  if (key) return unsplashUrl(CURATED_IMAGES[key]);
  return undefined;
}