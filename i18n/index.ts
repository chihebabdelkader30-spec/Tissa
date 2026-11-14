import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import { Language } from '@/constants/config';
export type TranslationKey = keyof typeof en;
const dictionaries = { en, fr, ar };
export function translate(language: Language, key: TranslationKey): string { return dictionaries[language][key] || en[key]; }
export const languages: { id: Language; label: string; subtitle: string }[] = [ { id: 'en', label: 'English', subtitle: 'Hello, good company.' }, { id: 'fr', label: 'Français', subtitle: 'Bienvenue à la table.' }, { id: 'ar', label: 'العربية', subtitle: 'أهلًا باللمة الحلوة' } ];
