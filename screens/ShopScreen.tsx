import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors,radii,spacing,type } from '@/constants/theme';
import { TranslationKey } from '@/i18n';
import { useCommerce } from '@/hooks/useCommerce';
import { useTranslation } from '@/hooks/useTissa';
interface Props {}
export function ShopScreen(_props: Props) {
  const { t,rtl } = useTranslation(); const { products,owned,busy,message,buy,restore } = useCommerce();
  return <Screen scroll={false}><FlatList data={products} keyExtractor={product=>product.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.header}><Header title={t('shopTitle')} subtitle={t('shopSub')}/><View style={styles.notice}><Text size={type.small} tone="accent" bold>{t('devShop')}</Text><Text size={type.label} tone="muted">{t('devPrices')}</Text></View>{message ? <View accessibilityLiveRegion="polite" style={styles.message}><Text>{message}</Text></View> : null}</View>} renderItem={({item})=><View style={styles.card}><View style={[styles.row,{flexDirection:rtl?'row-reverse':'row'}]}><View style={styles.icon}><Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} color={item.id==='bundle_all'?colors.accent:colors.primary} size={32}/></View><View style={styles.flex}><Text bold size={type.section}>{t(item.id)}</Text><Text tone="primary" size={type.section} bold>{item.price} <Text tone="muted" size={type.small}>DEMO</Text></Text></View></View><Text tone="muted">{t((item.id+'Desc') as TranslationKey)}</Text><Button label={t(owned.includes(item.id)?'owned':'buy')} disabled={owned.includes(item.id)||Boolean(busy)} busy={busy===item.id} variant={item.id==='bundle_all'?'yellow':'secondary'} onPress={()=>buy(item.id)}/></View>} ListFooterComponent={<Button label={t('restore')} icon="refresh-outline" variant="ghost" busy={busy==='restore'} disabled={Boolean(busy)} onPress={()=>{void restore();}}/>}/></Screen>;
}
const styles = StyleSheet.create({list:{gap:spacing.md,paddingBottom:spacing.xl},header:{gap:spacing.lg,paddingBottom:spacing.sm},notice:{backgroundColor:colors.raised,borderRadius:radii.sm,padding:spacing.md,gap:spacing.sm},message:{padding:spacing.md,borderRadius:radii.sm,borderWidth:1,borderColor:colors.primary,backgroundColor:colors.panel},card:{padding:spacing.lg,borderRadius:radii.md,backgroundColor:colors.panel,borderWidth:1,borderColor:colors.border,gap:spacing.md},row:{alignItems:'center',gap:spacing.md},icon:{height:64,width:64,borderRadius:radii.md,backgroundColor:colors.raised,alignItems:'center',justifyContent:'center'},flex:{flex:1} });
