import { memo, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Team } from '@/services/types';
import { Text } from '@/components/ui/Text';
import { useTranslation } from '@/hooks/useTissa';
interface RowProps { team: Team; index: number; maximum: number; mode: 'classic' | 'streak'; winner: boolean }
const RankingRow = memo(function RankingRow({ team, index, maximum, mode, winner }: RowProps) {
  const width = useSharedValue(0); const { t, rtl } = useTranslation(); const value = mode === 'streak' ? team.streak : team.score;
  useEffect(() => { width.value = withTiming(Math.max(0.06, Math.max(0, value) / Math.max(1, maximum)), { duration: 280 }); }, [value, maximum]);
  const bar = useAnimatedStyle(() => ({ width: `${width.value * 100}%` as `${number}%` }));
  return <View style={[styles.card, winner ? styles.winner : null]}><View style={[styles.row, { flexDirection: rtl ? 'row-reverse' : 'row' }]}><Text size={type.section} bold tone="muted">{String(index + 1).padStart(2, '0')}</Text><View style={styles.name}><Text bold size={type.section}>{team.name}</Text><Text tone="muted" size={type.small}>{mode === 'streak' ? t(team.eliminated ? 'out' : 'alive') : t('team')}</Text></View><Text size={type.title} bold tone={index === 0 ? 'accent' : 'text'}>{value}</Text></View><View style={[styles.track, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}><Animated.View style={[styles.bar, bar, winner ? styles.gold : null]}/></View>{mode === 'streak' ? <Text size={type.small} tone="muted">{team.score} {t('points')}</Text> : null}</View>;
});
interface Props { teams: Team[]; mode: 'classic' | 'streak'; winners?: string[]; header?: React.ReactElement; footer?: React.ReactElement }
export function Standings({ teams, mode, winners = [], header, footer }: Props) {
  const ranked = [...teams].sort((a,b) => Number(winners.includes(b.id)) - Number(winners.includes(a.id)) || (mode === 'streak' ? b.streak - a.streak : b.score - a.score));
  const maximum = Math.max(1, ...teams.map(t => mode === 'streak' ? t.streak : t.score));
  return <FlatList data={ranked} keyExtractor={team => team.id} showsVerticalScrollIndicator={false} ListHeaderComponent={header} ListFooterComponent={footer} renderItem={({ item, index }) => <RankingRow team={item} index={index} maximum={maximum} mode={mode} winner={winners.includes(item.id)}/>} contentContainerStyle={styles.list}/>;
}
const styles = StyleSheet.create({ list: { paddingBottom: spacing.lg, gap: spacing.md }, card: { borderRadius: radii.md, backgroundColor: colors.panel, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.border }, winner: { borderColor: colors.accent }, row: { alignItems: 'center', gap: spacing.md }, name: { flex: 1 }, track: { height: 5, backgroundColor: colors.raised, borderRadius: radii.pill, overflow: 'hidden' }, bar: { height: 5, borderRadius: radii.pill, backgroundColor: colors.primary }, gold: { backgroundColor: colors.accent } });
