import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  isNumber,
  stripHtmlTags,
  renderComparisonCell,
  renderCoverageCell,
  renderBenefitCell,
} from '../CellRendererUtils';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        description: '#000',
        lableText: 'green',
        red: 'red',
        primary: 'blue',
        backgroundColor: 'white',
      },
    },
  }),
}));

jest.mock('@constants/metrics', () => ({
  verticalScale: val => val,
}));

describe('CellRendererUtils', () => {
  describe('isNumber', () => {
    it('correctly identifies numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber('123')).toBe(true);
      expect(isNumber('123.45')).toBe(true);
      expect(isNumber('abc')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('stripHtmlTags', () => {
    it('removes HTML tags correctly', () => {
      expect(stripHtmlTags('<p>test</p>')).toBe('test');
      expect(stripHtmlTags('<div><span>nested</span></div>')).toBe('nested');
      expect(stripHtmlTags('no tags')).toBe('no tags');
      expect(stripHtmlTags(null)).toBe(null);
    });
  });

  describe('renderComparisonCell', () => {
    it('renders "Not Applicable" for null/undefined', () => {
      const { getByText } = render(renderComparisonCell(null));
      expect(getByText('Not Applicable')).toBeTruthy();
    });

    it('renders "Applicable"/"Not Applicable" for boolean types', () => {
      const { getByText: getByTextTrue } = render(renderComparisonCell(true, 0, 0, { type: 'boolean' }));
      expect(getByTextTrue('Applicable')).toBeTruthy();

      const { getByText: getByTextFalse } = render(renderComparisonCell(false, 0, 0, { type: 'boolean' }));
      expect(getByTextFalse('Not Applicable')).toBeTruthy();
    });

    it('renders price correctly', () => {
      const { getByText } = render(renderComparisonCell(1000, 0, 0, { type: 'price' }));
      // en-IN format might vary, but we expect AED 1,000 (or similar)
      expect(getByText(/AED/)).toBeTruthy();
    });
  });

  describe('renderCoverageCell', () => {
    it('renders special case for Loss & Damage', () => {
      const { getByText } = render(renderCoverageCell(true, 0, 0, { Title: 'Loss & Damage' }));
      expect(getByText('Applicable')).toBeTruthy();
    });

    it('renders numeric values as "Applicable"', () => {
      const { getByText } = render(renderCoverageCell(500));
      expect(getByText('Applicable')).toBeTruthy();
    });
  });

  describe('renderBenefitCell', () => {
    it('renders benefit with limitAmount and unit', () => {
      const benefit = { limitValues: [{ limitAmount: 500, limitUnit: 'AED' }] };
      const { getByText } = render(renderBenefitCell(null, 0, 0, benefit));
      expect(getByText('500 AED')).toBeTruthy();
    });

    it('renders cell text if it contains numeric digits', () => {
      const { getByText } = render(renderBenefitCell('100K ✕'));
      expect(getByText('100K ✕')).toBeTruthy();
    });
  });
});
