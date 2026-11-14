import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { colors, spacing, type } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTissa';
interface Props { title: string; subtitle?: string; back?: boolean; onBack?: () => void; right?: React.ReactNode }
export function Header({ title, subtitle, back = true, onBack, right }: Props) {
  const { rtl, t } = useTranslation();
  return <View style={styles.wrap}><View style={[styles.row, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>{back ? <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={onBack || (() => router.canGoBack() ? router.back() : router.replace('/'))} style={({ pressed }) => [styles.back, { opacity: pressed ? 0.5 : 1 }]}><Ionicons name={rtl ? 'arrow-forward' : 'arrow-back'} size={23} color={colors.text} /></Pressable> : null}<View style={styles.title}><Text size={type.title} bold>{title}</Text></View>{right}</View>{subtitle ? <Text tone="muted">{subtitle}</Text> : null}</View>;
}
const styles = StyleSheet.create({ wrap: { gap: spacing.sm }, row: { alignItems: 'center', gap: spacing.sm }, back: { minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center', marginStart: -spacing.sm }, title: { flex: 1 } });
