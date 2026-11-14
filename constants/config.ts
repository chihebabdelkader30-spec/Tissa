export type Language = 'en' | 'fr' | 'ar';
export type Pack = 'base' | 'football' | 'movies' | 'tunisia';
export const categories = ['general', 'arts', 'entertainment', 'sports', 'history', 'geography', 'food', 'science', 'social'] as const;
export type Category = typeof categories[number];
export const categoryIcons = { general: 'earth-outline', arts: 'color-palette-outline', entertainment: 'film-outline', sports: 'football-outline', history: 'hourglass-outline', geography: 'compass-outline', food: 'restaurant-outline', science: 'flask-outline', social: 'people-outline' } as const;
export const appVersion = '1.0.0';
export const storageKey = 'tissa.local.v1';
export const productIds = { remove_ads: 'remove_ads', pack_football: 'pack_football', pack_movies: 'pack_movies', pack_tunisia: 'pack_tunisia', bundle_all: 'bundle_all', jokers_pack: 'jokers_pack' } as const;
export type ProductId = keyof typeof productIds;
// Deliberately mocked until a signed Android development build and Play products are configured.
export const commerceMode: 'development' | 'production' = 'development';
export const storeUrl = 'https://play.google.com/store/apps/details?id=com.yourname.tissa';
