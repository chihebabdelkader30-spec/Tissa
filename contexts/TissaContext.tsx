import { createContext, ReactNode, useEffect, useRef } from 'react';
import { createTissaStore, TissaStore } from '@/store/createTissaStore';
export const TissaContext = createContext<TissaStore | null>(null);
export function TissaProvider({ children }: { children: ReactNode }) {
  const store = useRef<TissaStore | null>(null);
  if (!store.current) store.current = createTissaStore();
  useEffect(() => { void store.current?.getState().hydrate(); }, []);
  return <TissaContext.Provider value={store.current}>{children}</TissaContext.Provider>;
}
