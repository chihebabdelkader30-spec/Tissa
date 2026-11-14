import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AnswerRow } from '@/components/feature/AnswerRow';
import { Timer } from '@/components/feature/Timer';
import { useReader } from '@/hooks/useReader';
import { useTissa, useTranslation } from '@/hooks/useTissa';
import { shuffledAnswers } from '@/services/questions';
interface Props {}
export function QuestionScreen(_props: Props) {
  const { game, tap, leave, end, pause, resume } = useReader(); const { t } = useTranslation(); const total = useTissa(s => s.preferences.timer);
  const answers = useMemo(() => game?.question ? shuffledAnswers(game.question) : [], [game?.question?.id]);
  if (!game?.question) return <Screen><Button label={t('menu')} onPress={() => router.replace('/')}/></Screen>;
  const team = game.teams[game.active];
  return <Screen scroll={false}><Header title={team.name} onBack={leave} right={<Text tone="accent" bold>{game.found.length}/9</Text>}/><FlatList data={answers} keyExtractor={answer => answer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.top}><View style={styles.reader}><Ionicons name="eye-outline" color={colors.primary} size={16}/><Text tone="primary" size={type.small}>{t('readerOnly')}</Text></View><Timer remaining={game.remaining} total={total}/><View style={styles.question}><Text size={type.section} bold style={{ writingDirection: game.setup.language === 'ar' ? 'rtl' : 'ltr', textAlign: game.setup.language === 'ar' ? 'right' : 'left', fontFamily: game.setup.language === 'ar' ? 'Cairo_700Bold' : 'Poppins_700Bold' }}>{game.question.question}</Text></View><View style={styles.counter}><Text tone="muted" size={type.label}>{t('answers')}</Text><Text tone="accent" bold>{game.found.length} / 9</Text></View></View>} renderItem={({ item,index }) => <AnswerRow answer={item} index={index} found={game.found.includes(item)} onPress={() => tap(item)}/>}/><View style={styles.controls}><View style={styles.flex}><Button label={t('pause')} icon="pause" variant="secondary" onPress={pause}/></View><View style={styles.flex}><Button label={t('endEarly')} variant="ghost" onPress={end}/></View></View>{game.paused ? <View style={styles.overlay}><View style={styles.pauseCard}><Ionicons name="pause-circle-outline" size={72} color={colors.primary}/><Text size={type.title} bold centered>{t('paused')}</Text><Text centered tone="muted">{t('pauseBody')}</Text><Button label={t('resume')} icon="play" onPress={resume}/><Button label={t('leave')} variant="ghost" onPress={leave}/></View></View> : null}</Screen>;
}
const styles = StyleSheet.create({ list: { paddingBottom: spacing.md }, top: { gap: spacing.md, paddingVertical: spacing.md }, reader: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' }, question: { borderRadius: radii.md, backgroundColor: colors.raised, padding: spacing.lg }, counter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, controls: { flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.sm }, flex: { flex: 1 }, overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, zIndex: 10 }, pauseCard: { maxWidth: 440, width: '100%', gap: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.panel, padding: spacing.xl, alignItems: 'stretch' } });
