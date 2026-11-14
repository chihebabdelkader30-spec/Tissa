import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AnswerRow } from '@/components/feature/AnswerRow';
import { Confetti } from '@/components/feature/Confetti';
import { colors, radii, spacing, type } from '@/constants/theme';
import { useTissa, useTissaApi, useTranslation } from '@/hooks/useTissa';
interface Props {}
export function ResultScreen(_props: Props) {
  const game = useTissa(s => s.game); const api = useTissaApi(); const { t } = useTranslation(); const shake = useSharedValue(0); const flash = useSharedValue(0);
  useEffect(() => { if (game?.result?.bomb) { shake.value = withSequence(withTiming(-8,{duration:45}),withTiming(8,{duration:45}),withTiming(-8,{duration:45}),withTiming(8,{duration:45}),withTiming(0,{duration:45})); flash.value = withSequence(withTiming(0.6,{duration:70}),withTiming(0,{duration:220})); } }, [game?.result?.bomb]);
  const animated = useAnimatedStyle(() => ({ transform:[{translateX:shake.value}] })); const red = useAnimatedStyle(() => ({ opacity:flash.value }));
  if (!game?.question || !game.result) return <Screen><Button label={t('menu')} onPress={() => router.replace('/')}/></Screen>;
  const result = game.result; const rows = [...game.question.answers,...(game.question.bomb ? [game.question.bomb] : [])];
  const next = () => { api.getState().showScoreboard(); router.replace('/scoreboard'); };
  return <Screen scroll={false}><FlatList data={rows} keyExtractor={answer => answer} showsVerticalScrollIndicator={false} ListHeaderComponent={<Animated.View style={[styles.hero,animated]}><View style={styles.icon}><Ionicons name={result.bomb ? 'flame-outline' : result.complete ? 'trophy-outline' : 'checkmark-circle-outline'} size={56} color={result.bomb ? colors.danger : colors.accent}/></View><Text bold size={type.title} centered>{t(result.bomb ? 'bombTitle' : result.complete ? 'greatRound' : 'roundOver')}</Text><Text centered tone="muted">{game.teams[game.active].name}</Text><Text bold size={type.score} centered tone={result.points < 0 ? 'danger' : 'primary'}>{result.points > 0 ? '+' : ''}{result.points}</Text><Text centered tone="muted">{t('points')} · {result.correct}/9 {t('correct')}</Text>{result.complete ? <Text centered tone="accent">+3 {t('bonus')}</Text> : null}{game.joker && game.joker !== 'skip' ? <Text centered tone="primary">{t(game.joker)}</Text> : null}{result.bomb ? <Text centered tone="danger">−5 {t('bombPenalty')}</Text> : null}</Animated.View>} renderItem={({ item,index }) => <AnswerRow answer={item} index={index} found={game.found.includes(item)} bomb={item === game.question?.bomb} revealed/>} contentContainerStyle={styles.list}/><Button label={t('scoreboard')} icon="stats-chart-outline" onPress={next}/>{result.complete ? <Confetti/> : null}<Animated.View pointerEvents="none" style={[styles.flash,red]}/></Screen>;
}
const styles = StyleSheet.create({ hero: { alignItems:'center',gap:spacing.sm,padding:spacing.lg,marginBottom:spacing.lg,backgroundColor:colors.panel,borderRadius:radii.lg }, icon: { marginBottom:spacing.sm }, list: { paddingBottom:spacing.md }, flash: { ...StyleSheet.absoluteFillObject,backgroundColor:colors.danger,zIndex:20 } });
