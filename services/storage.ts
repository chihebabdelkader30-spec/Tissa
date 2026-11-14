import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKey } from '@/constants/config';
import { LocalData } from './types';
export const defaultData: LocalData = { preferences: { language: null, sound: true, haptics: true, timer: 60, consent: null }, stats: { games: 0, wins: {}, bestStreak: 0, correct: 0, ratePrompted: false }, seen: [], owned: [], extraJokers: 0 };
export async function readLocal(): Promise<LocalData> {
  try {
    const raw = await AsyncStorage.getItem(storageKey);
    if (!raw) return defaultData;
    const data = JSON.parse(raw);
    return { preferences: { ...defaultData.preferences, ...data.preferences }, stats: { ...defaultData.stats, ...data.stats, wins: data.stats?.wins || {} }, seen: Array.isArray(data.seen) ? data.seen : [], owned: Array.isArray(data.owned) ? data.owned : [], extraJokers: Math.max(0, Number(data.extraJokers) || 0) };
  } catch { return defaultData; }
}
let queue: Promise<unknown> = Promise.resolve();
export function saveLocal(data: LocalData): Promise<void> {
  const serialized = JSON.stringify(data);
  const next = queue.catch(() => undefined).then(() => AsyncStorage.setItem(storageKey, serialized));
  queue = next;
  return next;
}
