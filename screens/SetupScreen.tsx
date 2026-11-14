import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { categories, categoryIcons, Language, Pack, ProductId } from '@/constants/config';
import { colors, radii, spacing, type } from '@/constants/theme';
import { languages } from '@/i18n';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { useSetup } from '@/hooks/useSetup';
import { useTranslation } from '@/hooks/useTissa';
interface Props {}
export function SetupScreen(_props: Props) {
  const { setup, change, count, name, category, pack, start, owned } = useSetup(); const { t, rtl, font } = useTranslation();
  const blocks = ['teams','names','mode','rounds','language','categories','packs','start'];
  return <Screen scroll={false}><FlatList data={blocks} keyExtractor={item => item} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list} ListHeaderComponent={<Header title={t('setup')} subtitle={t('setupSub')}/>} renderItem={({ item }) => {
    if (item === 'teams') return <View style={styles.section}><Text bold size={type.section}>{t('teams')}</Text><View style={[styles.row, rtl ? styles.reverse : null]}>{[2,3,4,5,6].map(n => <View key={n} style={styles.flex}><Choice label={String(n)} selected={setup.names.length === n} onPress={() => count(n)}/></View>)}</View></View>;
    if (item === 'names') return <View style={styles.names}>{setup.names.map((value,i) => <View key={i} style={styles.name}><Text size={type.label} tone="muted">{t('teamName')} {i+1}</Text><TextInput accessibilityLabel={`${t('teamName')} ${i+1}`} value={value} onChangeText={text => name(i,text)} maxLength={24} style={[styles.input, { fontFamily: font, textAlign: rtl ? 'right' : 'left' }]} placeholderTextColor={colors.muted} selectTextOnFocus/></View>)}</View>;
    if (item === 'mode') return <View style={styles.section}><Text bold size={type.section}>{t('mode')}</Text><View style={[styles.row, rtl ? styles.reverse : null]}><View style={styles.flex}><Choice label={t('classic')} selected={setup.mode === 'classic'} onPress={() => change({ mode:'classic' })}/></View><View style={styles.flex}><Choice label={t('streak')} selected={setup.mode === 'streak'} onPress={() => change({ mode:'streak' })}/></View></View><Text tone="muted" size={type.label}>{t(setup.mode === 'classic' ? 'classicDesc' : 'streakDesc')}</Text></View>;
    if (item === 'rounds') return setup.mode === 'classic' ? <View style={styles.section}><Text bold size={type.section}>{t('rounds')}</Text><View style={styles.row}>{[5,10,15].map(n => <View key={n} style={styles.flex}><Choice label={String(n)} selected={setup.rounds === n} onPress={() => change({ rounds:n })}/></View>)}</View><Text tone="muted" size={type.label}>{t('roundNote')}</Text></View> : null;
    if (item === 'language') return <View style={styles.section}><Text bold size={type.section}>{t('questionLanguage')}</Text><View style={styles.row}>{languages.map(l => <View key={l.id} style={styles.flex}><Choice label={l.label} selected={setup.language === l.id} onPress={() => change({ language:l.id })}/></View>)}</View></View>;
    if (item === 'categories') return <View style={styles.section}><View style={[styles.between, rtl ? styles.reverse : null]}><Text bold size={type.section}>{t('categories')}</Text><Button label={t('selectAll')} variant="ghost" onPress={() => change({ categories: setup.categories.length === categories.length ? [] : [...categories] })}/></View><Text tone="primary" size={type.label}>{setup.categories.length} {t('selectedCount')}</Text><View style={styles.grid}>{categories.map(c => <View key={c} style={styles.category}><Choice label={t(c)} icon={categoryIcons[c]} selected={setup.categories.includes(c)} onPress={() => category(c)} wide/></View>)}</View></View>;
    if (item === 'packs') return <View style={styles.section}><Text bold size={type.section}>{t('packs')}</Text><View style={styles.grid}>{(['base','football','movies','tunisia'] as Pack[]).map(p => <View key={p} style={styles.pack}><Choice label={t(p)} selected={setup.packs.includes(p)} locked={p !== 'base' && !owned.includes(`pack_${p}` as ProductId)} onPress={() => pack(p)}/></View>)}</View></View>;
    return <Button label={t('startGame')} icon="play" onPress={start}/>;
  }}/></Screen>;
}
const styles = StyleSheet.create({ list: { gap: spacing.lg, paddingBottom: spacing.xl }, section: { gap: spacing.md }, row: { flexDirection: 'row', gap: spacing.sm }, reverse: { flexDirection: 'row-reverse' }, flex: { flex: 1 }, names: { gap: spacing.md }, name: { gap: spacing.sm }, input: { minHeight: 56, borderRadius: radii.sm, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingHorizontal: spacing.md, fontSize: type.body, includeFontPadding: false }, between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, category: { width: '31%', flexGrow: 1 }, pack: { width: '47%', flexGrow: 1 } });
