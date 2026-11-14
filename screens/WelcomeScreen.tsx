import { StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { languages } from '@/i18n';
import { Logo } from '@/components/feature/Logo';
import { Screen } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, radii, spacing, type } from '@/constants/theme';
import { useTissa, useTranslation } from '@/hooks/useTissa';
interface Props { consentOnly?: boolean }
export function WelcomeScreen({ consentOnly = false }: Props) {
  const preferences = useTissa(s => s.preferences); const setPreference = useTissa(s => s.setPreference); const { t, rtl } = useTranslation();
  const consent = consentOnly || preferences.language !== null;
  const finish = (choice: 'personalized' | 'limited') => { setPreference({ consent: choice }); router.replace('/'); };
  return <Screen><View style={styles.hero}><View style={styles.eyebrow}><View style={styles.dot}/><Text size={type.small} bold tone="primary">THE NINE-ANSWER PARTY GAME</Text></View><Logo size={112} vertical/><Text centered tone="muted">{t('languageIntro')}</Text></View><View style={styles.content}><Text size={type.title} bold>{t(consent ? 'consentTitle' : 'chooseLanguage')}</Text>{consent ? <><View style={styles.card}><Ionicons name="shield-checkmark-outline" color={colors.primary} size={32}/><Text>{t('consentBody')}</Text><Text tone="muted" size={type.label}>{t('consentNote')}</Text></View><Button label={t('limited')} onPress={() => finish('limited')}/><Button label={t('accept')} variant="secondary" onPress={() => finish('personalized')}/><View style={styles.links}><Button label={t('privacy')} variant="ghost" onPress={() => router.push('/privacy')}/><Button label={t('terms')} variant="ghost" onPress={() => router.push('/terms')}/></View></> : <>{languages.map(language => <Pressable key={language.id} accessibilityRole="button" accessibilityLabel={language.label} onPress={() => setPreference({ language: language.id })} style={({ pressed }) => [styles.language, { flexDirection: rtl ? 'row-reverse' : 'row', opacity: pressed ? 0.65 : 1 }]}><View style={styles.languageText}><Text bold size={type.section}>{language.label}</Text><Text size={type.label} tone="muted">{language.subtitle}</Text></View><Ionicons name="arrow-forward" size={21} color={colors.primary}/></Pressable>)}</>}</View><Text centered tone="muted" size={type.small}>2–6 teams · 9 answers · 1 phone</Text></Screen>;
}
const styles = StyleSheet.create({ hero: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg }, eyebrow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }, dot: { width: 6, height: 6, borderRadius: radii.pill, backgroundColor: colors.primary }, content: { gap: spacing.md }, language: { backgroundColor: colors.panel, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, gap: spacing.md, alignItems: 'center' }, languageText: { flex: 1 }, card: { backgroundColor: colors.panel, borderRadius: radii.md, padding: spacing.lg, gap: spacing.md }, links: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' } });
