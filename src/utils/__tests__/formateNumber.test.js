import { formatNumber, extractTextFromHTML } from '../formateNumber';

describe('formateNumber utils', () => {
  describe('formatNumber', () => {
    it('returns NaN for undefined or null, unless it is 0', () => {
      expect(formatNumber()).toBe('NaN');
      expect(formatNumber(null)).toBe('NaN');
      expect(formatNumber('')).toBe('NaN');
    });

    it('formats a regular integer correctly', () => {
      // 10000 -> 10,000.00 using en-IN style with min fraction 2
      expect(formatNumber(10000)).toBe('10,000.00');
    });

    it('formats a decimal correctly', () => {
      expect(formatNumber(1000.5)).toBe('1,000.50');
      expect(formatNumber(1000.555)).toBe('1,000.56'); // rounds to max fraction 2
    });

    it('formats 0 correctly', () => {
      expect(formatNumber(0)).toBe('00.00');
      expect(formatNumber('0')).toBe('00.00');
    });
  });

  describe('extractTextFromHTML', () => {
    it('returns empty string if no HTML is provided', () => {
      expect(extractTextFromHTML()).toBe('');
      expect(extractTextFromHTML(null)).toBe('');
    });

    it('strips simple HTML tags and converts &nbsp;', () => {
      const originalWindow = global.window;
      global.window = undefined; // Force server-side logic path

      const html = '<p>Hello <b>World</b>!&nbsp;How are you?</p>';
      expect(extractTextFromHTML(html)).toBe('Hello World! How are you?');

      global.window = originalWindow; // Restore
    });
  });
});
