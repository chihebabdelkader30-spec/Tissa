import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';
interface PieceProps { index: number }
function Piece({ index }: PieceProps) {
  const progress = useSharedValue(0);
  useEffect(() => { progress.value = withDelay(index * 35, withTiming(1, { duration: 2400 })); }, []);
  const style = useAnimatedStyle(() => ({ opacity: 1 - progress.value, transform: [{ translateY: progress.value * 360 }, { rotate: `${progress.value * (index % 2 ? 280 : -280)}deg` }] }));
  return <Animated.View style={[styles.piece, { left: `${(index * 17) % 97}%`, backgroundColor: [colors.primary, colors.accent, colors.danger][index % 3] }, style]}/>;
}
export function Confetti() { return <View pointerEvents="none" style={styles.cover}>{Array.from({ length: 21 }, (_, index) => <Piece key={index} index={index}/>)}</View>; }
const styles = StyleSheet.create({ cover: { ...StyleSheet.absoluteFillObject, zIndex: 5, overflow: 'hidden' }, piece: { position: 'absolute', top: 0, width: 7, height: 12, borderRadius: 2 } });
