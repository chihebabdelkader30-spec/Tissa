import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors,radii,spacing,type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTissa,useTranslation } from '@/hooks/useTissa';
interface Props {}
export function StatsScreen(_props: Props) {
  const stats=useTissa(s=>s.stats);const {t}=useTranslation();const wins=useMemo(()=>Object.entries(stats.wins).sort((a,b)=>b[1]-a[1]),[stats.wins]);
  return <Screen scroll={false}><FlatList data={wins} keyExtractor={item=>item[0]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.header}><Header title={t('stats')} subtitle={t('statsSub')}/><View style={styles.metrics}>{([{key:'gamesPlayed',value:stats.games,icon:'dice-outline'},{key:'totalCorrect',value:stats.correct,icon:'checkmark-circle-outline'},{key:'bestStreak',value:stats.bestStreak,icon:'flame-outline'}] as const).map(metric=><View key={metric.key} style={styles.metric}><Ionicons name={metric.icon} size={25} color={colors.primary}/><Text size={type.title} bold tone="accent" centered>{metric.value}</Text><Text size={type.small} centered tone="muted">{t(metric.key)}</Text></View>)}</View><Text size={type.section} bold>{t('teamWins')}</Text></View>} renderItem={({item,index})=><View style={styles.win}><Text tone="primary" bold>{index+1}</Text><Text bold style={styles.flex}>{item[0]}</Text><Text tone="accent" bold size={type.section}>{item[1]}</Text></View>} ListEmptyComponent={<View style={styles.empty}><Ionicons name="ribbon-outline" size={80} color={colors.accent}/><Text centered bold size={type.section}>{t('noStats')}</Text><Text centered tone="muted">{t('noStatsBody')}</Text><Button label={t('play')} onPress={()=>router.push('/setup')}/></View>}/></Screen>;
}
const styles=StyleSheet.create({list:{gap:spacing.md,paddingBottom:spacing.xl},header:{gap:spacing.lg,paddingBottom:spacing.sm},metrics:{flexDirection:'row',gap:spacing.sm},metric:{flex:1,backgroundColor:colors.panel,borderRadius:radii.md,padding:spacing.md,alignItems:'center',gap:spacing.sm},win:{backgroundColor:colors.panel,borderRadius:radii.md,padding:spacing.lg,flexDirection:'row',alignItems:'center',gap:spacing.md},flex:{flex:1},empty:{gap:spacing.lg,paddingVertical:spacing.xl,alignItems:'center'} });
