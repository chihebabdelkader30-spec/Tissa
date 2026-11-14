import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { useAlert } from '@/template';
import { shouldShowInterstitial } from '@/services/ads';
import { feedback } from '@/services/audio';
import { storeUrl } from '@/constants/config';
import { useTissa, useTissaApi, useTranslation } from './useTissa';
export function useFinal() {
  const game = useTissa(s => s.game); const stats = useTissa(s => s.stats); const owned = useTissa(s => s.owned); const api = useTissaApi(); const { t } = useTranslation(); const { showAlert } = useAlert(); const played = useRef(false);
  const [ad, setAd] = useState(() => shouldShowInterstitial(stats.games, owned.includes('remove_ads')));
  useEffect(() => { if (!game || played.current) return; played.current = true; const preferences = api.getState().preferences; void feedback('win', preferences.sound, preferences.haptics); }, [game, api]);
  useEffect(() => { if (ad || stats.games < 5 || stats.ratePrompted) return; api.getState().markRated(); showAlert(t('rateTitle'), t('rateBody'), [{ text: t('later'), style: 'cancel' }, { text: t('rate'), onPress: () => { void Linking.openURL(storeUrl).catch(() => undefined); } }]); }, [ad, stats.games, stats.ratePrompted]);
  const rematch = () => { if (!game) return; const result = api.getState().begin(game.setup); if (result === 'ok') router.replace('/handoff'); else { showAlert(t('setup'), t(result)); router.replace('/setup'); } };
  return { game, stats, ad, closeAd: () => setAd(false), rematch };
}
