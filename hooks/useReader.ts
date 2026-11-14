import { useCallback, useEffect } from 'react';
import { AppState, BackHandler } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAlert } from '@/template';
import { feedback, stopSounds } from '@/services/audio';
import { useTissa, useTissaApi, useTranslation } from './useTissa';
export function useReader() {
  const game = useTissa(s => s.game); const api = useTissaApi(); const { t } = useTranslation(); const { showAlert } = useAlert(); const navigation = useNavigation();
  const leave = useCallback(() => { api.getState().setPaused(true); showAlert(t('leaveTitle'), t('leaveBody'), [{ text: t('cancel'), style: 'cancel' }, { text: t('leave'), style: 'destructive', onPress: () => { api.getState().clearGame(); router.replace('/'); } }]); }, [api, showAlert, t]);
  useEffect(() => {
    if (game?.phase !== 'question') return;
    void activateKeepAwakeAsync('tissa-question').catch(() => undefined);
    const sub = AppState.addEventListener('change', state => { if (state !== 'active') { api.getState().setPaused(true); void stopSounds(); } });
    const back = BackHandler.addEventListener('hardwareBackPress', () => { leave(); return true; });
    const prevent = navigation.addListener('beforeRemove', event => { if (api.getState().game?.phase === 'question') { event.preventDefault(); leave(); } });
    return () => { sub.remove(); back.remove(); prevent(); void deactivateKeepAwake('tissa-question'); void stopSounds(); };
  }, [game?.phase, api, navigation, leave]);
  useEffect(() => {
    if (!game || game.phase !== 'question' || game.paused) return;
    const deadline = Date.now() + game.remaining * 1000;
    const timer = setInterval(() => {
      const state = api.getState(); if (state.game?.phase !== 'question' || state.game.paused) return;
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (remaining !== state.game.remaining) { state.setTime(remaining); if (remaining <= 10 && remaining > 0) void feedback('tick', state.preferences.sound, false); }
      if (remaining === 0) { state.endTurn(); router.replace('/result'); }
    }, 100);
    return () => clearInterval(timer);
  }, [game?.phase, game?.paused, game?.question?.id, api]);
  useEffect(() => { if (game?.phase === 'result') router.replace('/result'); }, [game?.phase]);
  const tap = useCallback((answer: string) => { const state = api.getState(); const g = state.game; if (!g || g.paused || g.phase !== 'question' || g.found.includes(answer)) return; const bomb = answer === g.question?.bomb; void feedback(bomb ? 'bomb' : g.found.length === 8 ? 'win' : 'correct', state.preferences.sound, state.preferences.haptics); state.tapAnswer(answer); }, [api]);
  const end = () => showAlert(t('endConfirm'), t('endBody'), [{ text: t('cancel'), style: 'cancel' }, { text: t('endEarly'), onPress: () => { api.getState().endTurn(); router.replace('/result'); } }]);
  return { game, tap, leave, end, pause: () => api.getState().setPaused(true), resume: () => api.getState().setPaused(false) };
}
