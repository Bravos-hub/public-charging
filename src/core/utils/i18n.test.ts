import { n, t, setLang, getCurrentLang } from './i18n';

describe('i18n utility', () => {
  beforeEach(() => {
    setLang('en');
  });

  describe('t()', () => {
    it('returns translation for existing key', () => {
      expect(t('discover')).toBe('Discover');
    });

    it('returns the key itself if translation is missing', () => {
      expect(t('non-existent-key')).toBe('non-existent-key');
    });

    it('returns translation for different language', () => {
      setLang('fr');
      expect(t('discover')).toBe('Découvrir');
    });
  });

  describe('n()', () => {
    it('formats a number correctly with default options', () => {
      // Note: Intl output might vary slightly by environment, but standard numbers are usually consistent
      const result = n(1234.56);
      expect(result).toMatch(/1,234\.56/);
    });

    it('formats a number with specific options', () => {
      const result = n(1234.56, { style: 'currency', currency: 'USD' });
      expect(result).toMatch(/\$1,234\.56/);
    });

    it('falls back to String(value) when Intl.NumberFormat fails', () => {
      // Providing an invalid option that should cause Intl.NumberFormat to throw
      // @ts-ignore - explicitly passing invalid style to trigger catch block
      const result = n(1234.56, { style: 'invalid' });
      expect(result).toBe('1234.56');
    });
  });

  describe('language management', () => {
    it('sets and gets the current language', () => {
      setLang('sw');
      expect(getCurrentLang()).toBe('sw');
    });

    it('falls back to default language for unknown language code', () => {
      // @ts-ignore
      setLang('es');
      expect(getCurrentLang()).toBe('en');
    });
  });
});
