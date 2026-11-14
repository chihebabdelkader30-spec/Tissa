import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/constants/theme';
import { useTissa, useTranslation } from '@/hooks/useTissa';
import { Text } from '@/components/ui/Text';
interface Props { compact?: boolean }
export function AdBanner({ compact = false }: Props) {
  const removed = useTissa(s => s.owned.includes('remove_ads')); const { t } = useTranslation();
  if (removed) return null;
  return <View style={[styles.banner, compact ? styles.compact : null]}><Ionicons name="megaphone-outline" color={colors.subtle} size={16}/><Text size={type.small} tone="muted" centered>{t('demoBanner')}</Text><Text size={type.small} tone="muted" centered>AdMob · TEST</Text></View>;
}
const styles = StyleSheet.create({ banner: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radii.sm, minHeight: 60, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm, padding: spacing.sm }, compact: { minHeight: 48 } });
