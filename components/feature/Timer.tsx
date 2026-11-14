import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, type } from '@/constants/theme';
import { Text } from '@/components/ui/Text';
import { useTranslation } from '@/hooks/useTissa';
interface Props { remaining: number; total: number }
export const Timer = memo(function Timer({ remaining, total }: Props) {
  const circumference = 2 * Math.PI * 48; const { t } = useTranslation(); const urgent = remaining <= 10;
  return <View accessibilityRole="timer" accessibilityLabel={`${remaining} ${t('seconds')}`} style={styles.wrap}><Svg width={116} height={116} viewBox="0 0 116 116"><Circle cx="58" cy="58" r="48" stroke={colors.raised} strokeWidth="7" fill="none"/><Circle cx="58" cy="58" r="48" stroke={urgent ? colors.danger : colors.primary} strokeWidth="7" fill="none" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - Math.max(0, Math.min(1, remaining / Math.max(1,total))))} strokeLinecap="round" transform="rotate(-90 58 58)"/></Svg><View style={styles.label}><Text size={type.hero} bold tone={urgent ? 'danger' : 'text'} centered>{remaining}</Text></View></View>;
});
const styles = StyleSheet.create({ wrap: { width: 116, height: 116, alignSelf: 'center' }, label: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center' } });
