import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';
interface Props { children: ReactNode; scroll?: boolean; padding?: boolean }
export function Screen({ children, scroll = true, padding = true }: Props) {
  return <SafeAreaView style={styles.safe} edges={['top','bottom']}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}><View style={styles.frame}>{scroll ? <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, padding ? styles.padding : null]}>{children}</ScrollView> : <View style={[styles.flex, padding ? styles.padding : null]}>{children}</View>}</View></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, frame: { flex: 1, width: '100%', maxWidth: 960, alignSelf: 'center' }, content: { flexGrow: 1, paddingBottom: spacing.lg }, padding: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.lg } });
