import { adConfig } from '@/constants/adConfig';
export function canShowAds(removed: boolean): boolean { return !removed && adConfig.mode === 'development'; }
// Explicit development-only ad simulation. Never grants reward for cancellation.
export async function rewardFromDevelopmentAd(completed: boolean): Promise<boolean> { return completed; }
export function shouldShowInterstitial(completedGames: number, removed: boolean): boolean { return !removed && completedGames > 0 && completedGames % 3 === 0; }
