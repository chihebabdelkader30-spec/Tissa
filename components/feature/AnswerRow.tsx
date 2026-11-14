import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Text } from '@/components/ui/Text';
import { useTranslation } from '@/hooks/useTissa';
interface Props { answer: string; index: number; found: boolean; onPress?: () => void; bomb?: boolean; revealed?: boolean }
export const AnswerRow = memo(function AnswerRow({ answer, index, found, onPress, bomb = false, revealed = false }: Props) {
  const { rtl, t } = useTranslation();
  return <Pressable accessibilityRole={onPress ? 'button' : 'text'} accessibilityLabel={`${answer}${found ? ', ' + t('correct') : ''}${bomb ? ', ' + t('bomb') : ''}`} accessibilityState={{ selected: found, disabled: !onPress || found }} disabled={!onPress || found} onPress={onPress} style={({ pressed }) => [styles.row, { flexDirection: rtl ? 'row-reverse' : 'row', opacity: pressed ? 0.75 : 1 }, found ? styles.found : null, bomb ? styles.bomb : null]}><View style={styles.number}>{found ? <Ionicons name="checkmark" size={19} color={colors.primary}/> : bomb ? <Ionicons name="flame-outline" size={19} color={colors.danger}/> : <Text tone="muted" size={type.label} centered>{index + 1}</Text>}</View><Text size={type.body} bold tone={bomb ? 'danger' : found ? 'primary' : revealed ? 'muted' : 'text'} style={styles.answer}>{answer}</Text>{onPress && !found ? <View style={styles.empty}/> : null}</Pressable>;
});
const styles = StyleSheet.create({ row: { backgroundColor: colors.panel, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, minHeight: 60, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }, found: { borderColor: colors.primary, backgroundColor: colors.raised }, bomb: { borderColor: colors.danger }, number: { width: 28, alignItems: 'center' }, answer: { flex: 1 }, empty: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: colors.subtle } });
