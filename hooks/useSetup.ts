import { useState } from 'react';
import { router } from 'expo-router';
import { categories, Category, Language, Pack, ProductId } from '@/constants/config';
import { Setup } from '@/services/types';
import { useTissa, useTranslation } from './useTissa';
import { useAlert } from '@/template';
export function useSetup() {
  const { t, language } = useTranslation(); const { showAlert } = useAlert();
  const owned = useTissa(s => s.owned); const begin = useTissa(s => s.begin);
  const [setup, setSetup] = useState<Setup>({ names: [t('team') + ' 1', t('team') + ' 2'], rounds: 5, mode: 'classic', language, categories: [...categories], packs: ['base'] });
  const change = (patch: Partial<Setup>) => setSetup(s => ({ ...s, ...patch }));
  const count = (number: number) => setSetup(s => ({ ...s, names: Array.from({ length: number }, (_, i) => s.names[i] || `${t('team')} ${i + 1}`) }));
  const name = (i: number, value: string) => setSetup(s => ({ ...s, names: s.names.map((n, index) => index === i ? value : n) }));
  const category = (value: Category) => setSetup(s => ({ ...s, categories: s.categories.includes(value) ? s.categories.filter(c => c !== value) : [...s.categories, value] }));
  const pack = (value: Pack) => { if (value !== 'base' && !owned.includes(`pack_${value}` as ProductId)) { router.push('/shop'); return; } setSetup(s => ({ ...s, packs: s.packs.includes(value) ? s.packs.filter(p => p !== value) : [...s.packs, value] })); };
  const start = () => { const result = begin(setup); if (result === 'ok') router.replace('/handoff'); else showAlert(t('setup'), t(result)); };
  return { setup, change, count, name, category, pack, start, owned };
}
