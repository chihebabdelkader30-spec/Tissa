import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Text } from './Text';
interface Props { label: string; selected: boolean; onPress: () => void; locked?: boolean; icon?: keyof typeof Ionicons.glyphMap; wide?: boolean }
export const Choice = memo(function Choice({ label, selected, onPress, locked, icon, wide }: Props) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.choice, selected ? styles.selected : null, wide ? styles.wide : null, { opacity: pressed ? 0.7 : 1 }]}>{icon ? <Ionicons name={icon} color={selected ? colors.primary : colors.muted} size={23} /> : null}<Text size={type.label} bold tone={selected ? 'primary' : 'muted'} centered>{label}</Text>{locked ? <Ionicons name="lock-closed-outline" size={16} color={colors.muted} /> : selected ? <View style={styles.dot} /> : null}</Pressable>;
});
const styles = StyleSheet.create({ choice: { minHeight: 48, borderRadius: radii.sm, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, selected: { backgroundColor: colors.raised, borderColor: colors.primary }, wide: { flex: 1, minHeight: 94, flexDirection: 'column', paddingHorizontal: spacing.sm }, dot: { width: 5, height: 5, borderRadius: radii.pill, backgroundColor: colors.primary } });
