import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Standings } from '@/components/feature/Standings';
import { AdBanner } from '@/components/feature/AdBanner';
import { isGameEnding } from '@/services/game';
import { useTissa, useTissaApi, useTranslation } from '@/hooks/useTissa';
import { spacing } from '@/constants/theme';
interface Props {}
export function ScoreboardScreen(_props: Props) {
  const game = useTissa(s => s.game); const api = useTissaApi(); const { t } = useTranslation();
  if (!game) return <Screen><Button label={t('menu')} onPress={() => router.replace('/')}/></Screen>;
  const next = () => { api.getState().next(); router.replace(api.getState().game?.phase === 'final' ? '/final' : '/handoff'); };
  return <Screen scroll={false}><Header title={t('scoreboard')} back={false} subtitle={`${t('turn')} ${game.turn} · ${t(game.suddenDeath ? 'suddenDeath' : game.setup.mode)}`}/><Standings teams={game.teams} mode={game.setup.mode} footer={<View style={styles.note}><Text tone="muted" centered>{game.teams[game.active].name}: {game.result?.points || 0} {t('points')}</Text><AdBanner/></View>}/><Button label={t(isGameEnding(game) ? 'finalScores' : 'nextTurn')} icon="arrow-forward" onPress={next}/></Screen>;
}
const styles = StyleSheet.create({ note: { gap:spacing.lg,paddingTop:spacing.sm } });
