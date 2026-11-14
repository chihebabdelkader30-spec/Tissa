import { memo } from 'react';
import { Text as NativeText, TextProps, StyleSheet } from 'react-native';
import { colors, type } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTissa';
interface Props extends TextProps { tone?: 'text' | 'muted' | 'primary' | 'accent' | 'danger' | 'ink'; size?: number; bold?: boolean; centered?: boolean }
export const Text = memo(function Text({ tone = 'text', size = type.body, bold = false, centered = false, style, ...props }: Props) {
  const locale = useTranslation();
  return <NativeText {...props} style={[styles.base, { color: colors[tone], fontSize: size, lineHeight: size * (locale.rtl ? 1.75 : 1.55), fontFamily: bold ? locale.bold : locale.font, textAlign: centered ? 'center' : locale.rtl ? 'right' : 'left', writingDirection: locale.rtl ? 'rtl' : 'ltr' }, style]} />;
});
const styles = StyleSheet.create({ base: { includeFontPadding: false, flexShrink: 1 } });
