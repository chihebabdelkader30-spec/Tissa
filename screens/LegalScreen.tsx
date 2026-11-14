import { Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors,radii,spacing,type } from '@/constants/theme';
import { storeUrl } from '@/constants/config';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTissa';
import { useAlert } from '@/template';
interface Props { kind: 'privacy' | 'terms' | 'rate' }
export function LegalScreen({kind}:Props) {
  const {t}=useTranslation();const {showAlert}=useAlert();
  return <Screen><Header title={t(kind==='rate'?'rate':kind)}/><View style={styles.card}><Ionicons name={kind==='rate'?'star-outline':'document-text-outline'} size={48} color={colors.primary}/><Text size={type.section} bold>{t(kind==='rate'?'rateTitle':kind)}</Text><Text tone="muted" style={styles.body}>{t(kind==='rate'?'rateBody':kind==='privacy'?'privacyText':'termsText')}</Text>{kind==='rate'?<Button label={t('rate')} onPress={()=>{void Linking.openURL(storeUrl).catch(()=>showAlert(t('rateTitle'),t('rateBody')));}}/>:null}</View></Screen>;
}
const styles=StyleSheet.create({card:{padding:spacing.lg,borderRadius:radii.md,backgroundColor:colors.panel,gap:spacing.lg},body:{lineHeight:29} });
