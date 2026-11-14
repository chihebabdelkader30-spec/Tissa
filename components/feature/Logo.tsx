import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, radii, spacing, type } from '@/constants/theme';
import { Text } from '@/components/ui/Text';
interface Props { size?: number; wordmark?: boolean; vertical?: boolean }
export const Logo = memo(function Logo({ size = 56, wordmark = true, vertical = false }: Props) {
  return <View style={[styles.wrap, vertical ? styles.vertical : null]}><Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="Tissa nine-dot logo"><Rect width="120" height="120" rx="28" fill={colors.raised}/><Circle cx="30" cy="30" r="9" fill={colors.accent}/><Circle cx="60" cy="30" r="9" fill={colors.accent}/><Circle cx="90" cy="30" r="9" fill={colors.accent}/><Circle cx="30" cy="60" r="9" fill={colors.accent}/><Circle cx="60" cy="60" r="9" fill={colors.accent}/><Circle cx="90" cy="60" r="9" fill={colors.danger}/><Path d="M94 52Q105 44 101 39" stroke={colors.danger} strokeWidth="3" fill="none" strokeLinecap="round"/><Circle cx="101" cy="37" r="2" fill={colors.accent}/><Circle cx="30" cy="90" r="9" fill={colors.accent}/><Circle cx="60" cy="90" r="9" fill={colors.accent}/><Circle cx="90" cy="90" r="9" fill={colors.accent}/></Svg>{wordmark ? <View style={vertical ? styles.wordVertical : undefined}><Text bold size={vertical ? type.hero : type.title} centered={vertical}>Tissa<Text tone="primary" bold size={vertical ? type.hero : type.title}>.</Text></Text><Text tone="muted" size={vertical ? type.section : type.label} centered={vertical}>تسعة</Text></View> : null}</View>;
});
const styles = StyleSheet.create({ wrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, vertical: { flexDirection: 'column', gap: spacing.lg }, wordVertical: { alignItems: 'center' } });
