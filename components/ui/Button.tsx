import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Text } from './Text';
import { useTranslation } from '@/hooks/useTissa';
interface Props { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'yellow'; icon?: keyof typeof Ionicons.glyphMap; disabled?: boolean; busy?: boolean; style?: ViewStyle }
export const Button = memo(function Button({ label, onPress, variant = 'primary', icon, disabled, busy, style }: Props) {
  const { rtl } = useTranslation(); const bright = variant === 'primary' || variant === 'yellow';
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: Boolean(disabled || busy) }} disabled={disabled || busy} onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], { flexDirection: rtl ? 'row-reverse' : 'row', opacity: disabled ? 0.42 : pressed ? 0.78 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>{busy ? <ActivityIndicator color={bright ? colors.ink : colors.text} /> : icon ? <Ionicons name={icon} size={22} color={bright ? colors.ink : colors.text} /> : null}<Text bold size={type.body} tone={bright ? 'ink' : 'text'} centered>{label}</Text></Pressable>;
});
const styles = StyleSheet.create({ base: { minHeight: 56, borderRadius: radii.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, primary: { backgroundColor: colors.primary }, secondary: { backgroundColor: colors.raised, borderWidth: 1, borderColor: colors.border }, danger: { backgroundColor: colors.danger }, ghost: { backgroundColor: colors.transparent }, yellow: { backgroundColor: colors.accent } });
