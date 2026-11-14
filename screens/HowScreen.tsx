import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors,radii,spacing,type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTissa';
interface Props {}
export function HowScreen(_props: Props) {
  const { t,rtl } = useTranslation();
  const steps = [{title:'step1',body:'step1Body',icon:'reader-outline'},{title:'step2',body:'step2Body',icon:'chatbubbles-outline'},{title:'step3',body:'step3Body',icon:'trophy-outline'}] as const;
  return <Screen scroll={false}><FlatList data={steps} keyExtractor={step=>step.title} showsVerticalScrollIndicator={false} ListHeaderComponent={<Header title={t('how')} subtitle={t('howTitle')}/>} contentContainerStyle={styles.list} renderItem={({item,index})=><View style={styles.card}><View style={[styles.row,{flexDirection:rtl?'row-reverse':'row'}]}><View style={styles.illustration}><Ionicons name={item.icon} size={48} color={index===2?colors.accent:colors.primary}/></View><View style={styles.title}><Text tone="primary" size={type.small} bold>0{index+1}</Text><Text bold size={type.section}>{t(item.title)}</Text></View></View><Text tone="muted">{t(item.body)}</Text></View>} ListFooterComponent={<View style={styles.footer}><Text bold size={type.section}>{t('rules')}</Text><Text tone="muted">{t('jokerRules')}</Text><Text tone="muted">{t('tieRules')}</Text><Button label={t('play')} onPress={()=>router.push('/setup')}/></View>}/></Screen>;
}
const styles = StyleSheet.create({list:{gap:spacing.lg,paddingBottom:spacing.xl},card:{backgroundColor:colors.panel,borderRadius:radii.md,padding:spacing.lg,gap:spacing.lg,borderWidth:1,borderColor:colors.border},row:{alignItems:'center',gap:spacing.lg},illustration:{width:80,height:80,borderRadius:radii.md,backgroundColor:colors.raised,alignItems:'center',justifyContent:'center'},title:{flex:1},footer:{gap:spacing.lg} });
