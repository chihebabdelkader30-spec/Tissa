import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Joker } from '@/services/types';
import { rewardFromDevelopmentAd } from '@/services/ads';
import { useTissa, useTissaApi, useTranslation } from '@/hooks/useTissa';
import { useAlert } from '@/template';
interface Props {}
export function HandoffScreen(_props: Props) {
  const game = useTissa(s => s.game); const api = useTissaApi(); const extras = useTissa(s => s.extraJokers); const owned = useTissa(s => s.owned); const rewardedTurn = useTissa(s => s.rewardedTurn); const { t } = useTranslation(); const { showAlert } = useAlert();
  if (!game) return <Screen><Button label={t('menu')} onPress={() => router.replace('/')}/></Screen>;
  if (game.phase === 'final') return <Screen><Text>{t('poolEmptyBody')}</Text><Button label={t('finalScores')} onPress={() => router.replace('/final')}/></Screen>;
  const team = game.teams[game.active]; const available = (game.extra[team.id] || 0) + extras;
  const reward = () => showAlert(t('rewardTitle'), t('rewardBody'), [{ text: t('cancel'), style:'cancel' }, { text: t('completeAd'), onPress: () => { void rewardFromDevelopmentAd(true).then(completed => { if (completed) api.getState().addReward(); }); } }]);
  const start = () => { api.getState().startTurn(); if (api.getState().game?.phase === 'question') router.replace('/question'); };
  return <Screen><Header title={game.suddenDeath ? t('suddenDeath') : `${t('turn')} ${game.turn}${game.setup.mode === 'classic' ? ' / ' + game.setup.rounds : ''}`} onBack={() => showAlert(t('leaveTitle'),t('leaveBody'),[{text:t('cancel'),style:'cancel'},{text:t('leave'),style:'destructive',onPress:()=>{api.getState().clearGame();router.replace('/');}}])}/><View style={styles.hero}><View style={styles.illustration}><Ionicons name="phone-portrait-outline" size={80} color={colors.primary}/><View style={styles.badge}><Ionicons name="hand-left-outline" size={25} color={colors.ink}/></View></View><Text centered tone="muted">{t('handoff')}</Text><Text centered bold size={type.hero}>{team.name}</Text><View style={styles.pill}><Ionicons name="eye-outline" size={18} color={colors.primary}/><Text tone="primary" bold>{t('reader')}</Text></View><Text centered tone="muted">{t('handoffBody')}</Text></View><View style={styles.section}><Text size={type.section} bold>{t('jokerTitle')}</Text><Text tone="muted" size={type.label}>{t('jokerSub')}</Text><View style={styles.jokers}>{(['plus','double','skip'] as Joker[]).map(joker => <View style={styles.joker} key={joker}><Choice label={t(joker)} icon={joker === 'skip' ? 'swap-horizontal-outline' : joker === 'plus' ? 'add-circle-outline' : 'flash-outline'} selected={game.joker === joker} locked={team.jokers[joker] && (joker === 'skip' || available <= 0) && game.joker !== joker} onPress={() => api.getState().chooseJoker(joker)} wide/><Text centered tone="muted" size={type.small}>{game.joker === joker ? t('selected') : team.jokers[joker] ? t('used') : '1×'}</Text></View>)}</View>{game.joker === 'skip' ? <Text tone="primary" size={type.label}>{t('skipHint')}</Text> : null}{available > 0 ? <><Text tone="accent" size={type.label}>{t('extraAvailable')}: {available}</Text><Text tone="muted" size={type.small}>{t('extraHint')}</Text></> : null}</View><Button label={t('start')} icon="play" onPress={start}/>{!owned.includes('remove_ads') ? <Button label={t('extraJoker')} icon="play-circle-outline" variant="ghost" disabled={rewardedTurn === game.turn} onPress={reward}/> : null}</Screen>;
}
const styles = StyleSheet.create({ hero: { borderRadius: radii.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.md, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border }, illustration: { width: 128, height: 128, borderRadius: radii.lg, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.md }, badge: { position: 'absolute', bottom: 5, right: 0, backgroundColor: colors.accent, borderRadius: radii.pill, padding: spacing.sm }, pill: { backgroundColor: colors.raised, borderRadius: radii.pill, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' }, section: { gap: spacing.md }, jokers: { flexDirection: 'row', gap: spacing.sm }, joker: { flex: 1, gap: spacing.sm } });
