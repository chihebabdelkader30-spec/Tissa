import { useState } from 'react';
import { ProductId } from '@/constants/config';
import { products, purchaseProduct, PurchaseOutcome, restoreProducts } from '@/services/iap';
import { useAlert } from '@/template';
import { useTissa, useTissaApi, useTranslation } from './useTissa';
export function useCommerce() {
  const { showAlert } = useAlert(); const { t } = useTranslation(); const api = useTissaApi(); const owned = useTissa(s => s.owned);
  const [busy, setBusy] = useState<ProductId | 'restore' | null>(null);
  const [message, setMessage] = useState('');
  const execute = async (id: ProductId, outcome: PurchaseOutcome) => {
    setBusy(id); setMessage('');
    try { const result = await purchaseProduct(id, outcome); if (result === 'success') api.getState().buy(id); setMessage(t(result === 'success' ? 'purchaseSuccess' : result === 'pending' ? 'purchasePending' : result === 'failed' ? 'purchaseFailed' : 'purchaseCancelled')); } catch { setMessage(t('purchaseFailed')); } finally { setBusy(null); }
  };
  const buy = (id: ProductId) => showAlert(t('purchaseTitle'), t('purchaseBody'), [ { text: t('success'), onPress: () => { void execute(id, 'success'); } }, { text: t('pending'), onPress: () => { void execute(id, 'pending'); } }, { text: t('failed'), onPress: () => { void execute(id, 'failed'); } }, { text: t('cancel'), style: 'cancel', onPress: () => { void execute(id, 'cancelled'); } } ]);
  const restore = async () => { setBusy('restore'); try { const result = await restoreProducts(api.getState().owned); api.getState().restore(result); setMessage(t('restored')); } catch { setMessage(t('purchaseFailed')); } finally { setBusy(null); } };
  return { products, owned, busy, message, buy, restore };
}
