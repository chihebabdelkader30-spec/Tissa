import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Standings } from '@/components/feature/Standings';
import { Confetti } from '@/components/feature/Confetti';
import { useFinal } from '@/hooks/useFinal';
import { useTissaApi, useTranslation } from '@/hooks/useTissa';
interface Props {}
export function FinalScreen(_props: Props) {
  const { game, ad, closeAd, rematch } = useFinal(); const { t } = useTranslation(); const api = useTissaApi();
  if (!game) return <Screen><Button label={t('menu')} onPress={() => router.replace('/')}/></Screen>;
  const winners = game.teams.filter(team => game.winnerIds.includes(team.id));
  const hero = <View style={styles.hero}><View style={styles.trophy}><Ionicons name="trophy-outline" size={76} color={colors.accent}/></View><Text tone="accent" bold size={type.label} centered>{t(winners.length > 1 ? 'tied' : 'winner')}</Text><Text bold size={type.hero} centered>{winners.map(team => team.name).join(' & ')}</Text><Text centered tone="muted">{t('podiumSub')}</Text></View>;
  const footer = <View style={styles.controls}><Button label={t('rematch')} icon="refresh-outline" onPress={rematch}/><Button label={t('newGame')} variant="secondary" onPress={() => {api.getState().clearGame();router.replace('/setup');}}/><Button label={t('menu')} variant="ghost" onPress={() => {api.getState().clearGame();router.replace('/');}}/></View>;
  return <Screen scroll={false}><Standings teams={game.teams} mode={game.setup.mode} winners={game.winnerIds} header={hero} footer={footer}/>{!ad ? <Confetti/> : null}{ad ? <View style={styles.overlay}><View style={styles.ad}><Ionicons name="megaphone-outline" size={48} color={colors.primary}/><Text size={type.title} centered bold>{t('interstitialTitle')}</Text><Text centered tone="muted">{t('interstitialBody')}</Text><Button label={t('close')} onPress={closeAd}/></View></View> : null}</Screen>;
}
const styles = StyleSheet.create({ hero:{gap:spacing.md,alignItems:'center',paddingVertical:spacing.xl},trophy:{height:120,width:120,borderRadius:radii.lg,backgroundColor:colors.raised,alignItems:'center',justifyContent:'center'},controls:{gap:spacing.md,paddingVertical:spacing.lg},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:colors.overlay,alignItems:'center',justifyContent:'center',padding:spacing.lg},ad:{maxWidth:440,width:'100%',padding:spacing.xl,borderRadius:radii.lg,backgroundColor:colors.panel,gap:spacing.lg} });
