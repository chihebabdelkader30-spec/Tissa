import { commerceMode, ProductId } from '@/constants/config';
export type PurchaseOutcome = 'success' | 'cancelled' | 'pending' | 'failed';
export const products: { id: ProductId; icon: string; price: string }[] = [
  { id: 'remove_ads', icon: 'sparkles-outline', price: '$2.99' },
  { id: 'pack_football', icon: 'football-outline', price: '$1.99' },
  { id: 'pack_movies', icon: 'film-outline', price: '$1.99' },
  { id: 'pack_tunisia', icon: 'sunny-outline', price: '$1.99' },
  { id: 'bundle_all', icon: 'gift-outline', price: '$6.99' },
  { id: 'jokers_pack', icon: 'flash-outline', price: '$0.99' },
];
// Simulator intentionally performs no billing. Native production adapter must use verified Google Play entitlements.
export async function purchaseProduct(_id: ProductId, outcome: PurchaseOutcome = 'success'): Promise<PurchaseOutcome> {
  if (commerceMode !== 'development') throw new Error('Native billing adapter is not configured');
  return outcome;
}
export async function restoreProducts(cached: ProductId[]): Promise<ProductId[]> {
  if (commerceMode !== 'development') throw new Error('Native billing adapter is not configured');
  return cached;
}
export function expandEntitlement(id: ProductId): ProductId[] {
  return id === 'bundle_all' ? ['bundle_all', 'remove_ads', 'pack_football', 'pack_movies', 'pack_tunisia'] : id === 'jokers_pack' ? [] : [id];
}
