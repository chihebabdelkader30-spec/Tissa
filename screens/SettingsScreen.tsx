import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { languages } from '@/i18n';
import { appVersion } from '@/constants/config';
import { colors,radii,spacing,type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Choice } from '@/components/ui/Choice';
import { Button } from '@/components/ui/Button';
import { useTissa,useTissaApi,useTranslation } from '@/hooks/useTissa';
import { useCommerce } from '@/hooks/useCommerce';
import { useAlert } from '@/template';
interface Props {}
export function SettingsScreen(_props: Props) {
  const preferences = useTissa(s=>s.preferences);const api=useTissaApi();const {t,rtl}=useTranslation();const {showAlert}=useAlert();const {restore,busy,message}=useCommerce();
  const reset=()=>showAlert(t('resetConfirm'),t('resetBody'),[{text:t('cancel'),style:'cancel'},{text:t('reset'),style:'destructive',onPress:()=>api.getState().resetHistory()}]);
  return <Screen><Header title={t('settings')} subtitle={t('settingsSub')}/><View style={styles.section}><Text bold size={type.section}>{t('uiLanguage')}</Text><View style={styles.row}>{languages.map(l=><View key={l.id} style={styles.flex}><Choice label={l.label} selected={preferences.language===l.id} onPress={()=>api.getState().setPreference({language:l.id})}/></View>)}</View></View><View style={styles.panel}>{(['sound','haptics'] as const).map(key=><Pressable key={key} accessibilityRole="switch" accessibilityState={{checked:preferences[key]}} accessibilityLabel={t(key)} onPress={()=>api.getState().setPreference({[key]:!preferences[key]})} style={({pressed})=>[styles.toggle,{flexDirection:rtl?'row-reverse':'row',opacity:pressed?0.7:1}]}><Ionicons name={key==='sound'?'volume-high-outline':'phone-portrait-outline'} color={colors.primary} size={23}/><Text bold style={styles.flex}>{t(key)}</Text><View style={[styles.switch,preferences[key]?styles.active:null]}><View style={[styles.thumb,{alignSelf:preferences[key]?'flex-end':'flex-start'}]}/></View><Text tone="muted" size={type.small}>{t(preferences[key]?'on':'off')}</Text></Pressable>)}</View><View style={styles.section}><Text bold size={type.section}>{t('timer')}</Text><View style={styles.row}>{([45,60,90] as const).map(timer=><View key={timer} style={styles.flex}><Choice label={`${timer}s`} selected={preferences.timer===timer} onPress={()=>api.getState().setPreference({timer})}/></View>)}</View></View><View style={styles.section}><Button label={t('resetHistory')} icon="refresh-outline" variant="secondary" onPress={reset}/><Button label={t('privacyChoices')} icon="shield-checkmark-outline" variant="secondary" onPress={()=>router.push('/consent')}/><Button label={t('restore')} icon="bag-check-outline" variant="secondary" busy={busy==='restore'} onPress={()=>{void restore();}}/>{message?<Text tone="primary">{message}</Text>:null}<Button label={t('privacy')} variant="ghost" onPress={()=>router.push('/privacy')}/><Button label={t('terms')} variant="ghost" onPress={()=>router.push('/terms')}/></View><Text tone="muted" size={type.small} centered>Tissa / تسعة · {t('version')} {appVersion}</Text></Screen>;
}
const styles=StyleSheet.create({section:{gap:spacing.md},row:{flexDirection:'row',gap:spacing.sm},flex:{flex:1},panel:{backgroundColor:colors.panel,borderRadius:radii.md,padding:spacing.md,gap:spacing.md},toggle:{minHeight:60,alignItems:'center',gap:spacing.md},switch:{width:48,height:28,borderRadius:radii.pill,padding:3,backgroundColor:colors.border},active:{backgroundColor:colors.primary},thumb:{width:22,height:22,borderRadius:radii.pill,backgroundColor:colors.surface} });
