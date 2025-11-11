/**
 * i18n Loader (TypeScript)
 * Minimal translation loader with language switch and number/date helpers.
 */

export type Language = 'en' | 'fr' | 'sw';

interface Dictionary {
  [key: string]: string;
}

const dictionaries: Record<Language, Dictionary> = {
  en: {
    discover: 'Discover',
    activity: 'Activity',
    wallet: 'Wallet',
    profile: 'Profile',
    searchArea: 'Search this area',
    findStation: 'Find EV Charger Station…',
  },
  fr: {
    discover: 'Découvrir',
    activity: 'Activité',
    wallet: 'Portefeuille',
    profile: 'Profil',
    searchArea: 'Rechercher dans cette zone',
    findStation: 'Rechercher une borne EV…',
  },
  sw: {
    discover: 'Gundua',
    activity: 'Shughuli',
    wallet: 'Pochi',
    profile: 'Wasifu',
    searchArea: 'Tafuta eneo hili',
    findStation: 'Tafuta kituo cha kuchaji…',
  },
};

let current: Language = 'en';

export function setLang(code: string): void {
  current = dictionaries[code as Language] ? (code as Language) : 'en';
}

export function t(key: string): string {
  return dictionaries[current][key] || key;
}

export function n(value: number, opts?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(current, opts).format(value);
  } catch {
    return String(value);
  }
}

export function d(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(current, opts).format(new Date(date));
  } catch {
    return String(date);
  }
}

export function getCurrentLang(): Language {
  return current;
}

