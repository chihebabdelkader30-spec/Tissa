import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors,spacing } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { Logo } from '@/components/feature/Logo';
import { Text } from '@/components/ui/Text';
import { useTissa,useTranslation } from '@/hooks/useTissa';
import { MenuScreen } from '@/screens/MenuScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
export default function HomePage() {
  const hydrated=useTissa(s=>s.hydrated);const preferences=useTissa(s=>s.preferences);const storageError=useTissa(s=>s.storageError);const {t}=useTranslation();
  if(!hydrated)return <Screen><View style={styles.loading}><Logo size={100} vertical/><ActivityIndicator color={colors.primary}/><Text centered tone="muted">{t('loading')}</Text></View></Screen>;
  if(!preferences.language||!preferences.consent)return <WelcomeScreen/>;
  return <View style={styles.flex}>{storageError?<View style={styles.error}><Text tone="accent">{t('saveError')}</Text></View>:null}<MenuScreen/></View>;
}
const styles=StyleSheet.create({flex:{flex:1,backgroundColor:colors.background},loading:{flex:1,justifyContent:'center',alignItems:'center',gap:spacing.lg},error:{padding:spacing.md,backgroundColor:colors.panel} });
