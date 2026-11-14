import { useCallback, useContext } from 'react';
import { useStore } from 'zustand';
import { TissaContext } from '@/contexts/TissaContext';
import { TissaState } from '@/store/createTissaStore';
import { translate, TranslationKey } from '@/i18n';
export function useTissa<T>(selector: (state: TissaState) => T): T { const store = useContext(TissaContext); if (!store) throw new Error('TissaProvider is required'); return useStore(store, selector); }
export function useTissaApi() { const store = useContext(TissaContext); if (!store) throw new Error('TissaProvider is required'); return store; }
export function useTranslation() {
  const language = useTissa(s => s.preferences.language) || 'en';
  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);
  return { t, language, rtl: language === 'ar', font: language === 'ar' ? 'Cairo_400Regular' : 'Poppins_400Regular', bold: language === 'ar' ? 'Cairo_700Bold' : 'Poppins_700Bold' };
}
