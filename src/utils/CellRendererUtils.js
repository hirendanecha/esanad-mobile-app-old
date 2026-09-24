import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { formatNumber } from './formateNumber';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

export const isNumber = value => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Strip HTML tags from string
export const stripHtmlTags = html => {
  if (!html || typeof html !== 'string') return html;
  return html.replace(/<[^>]*>/g, '').trim();
};

// MOTOR INSURANCE RENDERERS
export const renderComparisonCell = (cell, rowIndex, colIndex, rowData) => (
  <ComparisonCell cell={cell} rowIndex={rowIndex} colIndex={colIndex} rowData={rowData} />
);

const ComparisonCell = ({ cell, rowIndex, colIndex, rowData }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  if (cell === undefined || cell === null) {
    return (
      <Text style={[styles.cellText, styles.notApplicableText]}>
        Not Applicable
      </Text>
    );
  }

  if (rowData?.type === 'boolean') {
    return (
      <Text
        style={[
          styles.cellText,
          cell ? styles.applicableText : styles.notApplicableText,
        ]}
      >
        {cell ? 'Applicable' : 'Not Applicable'}
      </Text>
    );
  }

  if (rowData?.type === 'price') {
    return <Text style={styles.cellText}>AED {formatNumber(cell)}</Text>;
  }

  if (typeof cell === 'string' && cell.startsWith('AED')) {
    return <Text style={styles.cellText}>{cell}</Text>;
  }

  if (isNumber(cell)) {
    return (
      <Text style={[styles.cellText, styles.applicableText]}>
        {cell == '0' ? 'Applicable' : cell}
      </Text>
    );
  }

  if (cell === '✕') {
    return <Text style={[styles.cellText, styles.notApplicableText]}>✕</Text>;
  }

  return <Text style={styles.cellText}>{cell}</Text>;
};

export const renderCoverageCell = (cell, rowIndex, colIndex, coverage) => (
  <CoverageCell cell={cell} rowIndex={rowIndex} colIndex={colIndex} coverage={coverage} />
);

const CoverageCell = ({ cell, rowIndex, colIndex, coverage }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  if (cell === undefined || cell === null) {
    return (
      <Text style={[styles.cellText, styles.notApplicableText]}>
        Not Applicable
      </Text>
    );
  }

  // Handle Loss & Damage special case
  if (coverage?.Title === 'Loss & Damage' || cell === 'Vehicle Value') {
    const carValue = coverage?.carValues?.[colIndex];
    return (
      <Text
        style={[
          styles.cellText,
          cell ? styles.applicableText : styles.notApplicableText,
        ]}
      >
        {cell ? 'Applicable' : 'Not Applicable'}
      </Text>
    );
  }

  if (!isNumber(cell) && cell) {
    return <Text style={[styles.cellText, styles.applicableText]}>{cell}</Text>;
  }

  return (
    <Text style={[styles.cellText, styles.applicableText]}>
      {cell == '0' ? 'Applicable' : 'Applicable'}
    </Text>
  );
};

export const renderBenefitCell = (cell, rowIndex, colIndex, benefit) => (
  <BenefitCell cell={cell} rowIndex={rowIndex} colIndex={colIndex} benefit={benefit} />
);

const BenefitCell = ({ cell, rowIndex, colIndex, benefit }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const limitValue = benefit?.limitValues?.[colIndex];

  if (limitValue?.limitAmount > 0 && (cell === undefined || cell === null || cell === '')) {
    return (
      <Text style={styles.cellText}>
        {`${limitValue.limitAmount} ${limitValue.limitUnit}`}
      </Text>
    );
  }

  if (cell === undefined || cell === null) {
    return (
      <Text style={[styles.cellText, styles.notApplicableText]}>
        Not Applicable
      </Text>
    );
  }

  if (limitValue?.limitAmount > 0) {
    return <Text style={styles.cellText}>{`${cell}`}</Text>;
  }

  if (cell && typeof cell === 'string' && cell.startsWith('AED')) {
    return <Text style={styles.cellText}>{cell}</Text>;
  }

  if (cell && /\d/.test(cell)) {
    return <Text style={styles.cellText}>{cell}</Text>;
  }

  return (
    <Text style={[styles.cellText, styles.applicableText]}>
      {cell || 'Applicable'}
    </Text>
  );
};

// HEALTH INSURANCE RENDERERS
export const renderHealthComparisonCell = (cell, rowIndex, colIndex, row) => (
  <HealthComparisonCell cell={cell} rowIndex={rowIndex} colIndex={colIndex} row={row} />
);

const HealthComparisonCell = ({ cell, rowIndex, colIndex, row }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  if (cell === undefined || cell === null) {
    return <Text style={[styles.cellText, styles.notApplicableText]}>-</Text>;
  }

  // Handle "Contact us for price" or "Price upon request"
  if (
    typeof cell === 'string' &&
    (cell.includes('Contact us') || cell.includes('Price upon request'))
  ) {
    return (
      <Text style={[styles.cellText, styles.warningText]} numberOfLines={2}>
        {cell}
      </Text>
    );
  }

  // Handle AED prices
  if (typeof cell === 'string' && cell.startsWith('AED')) {
    return <Text style={[styles.cellText, styles.priceText]}>{cell}</Text>;
  }

  // Handle numbers
  if (isNumber(cell)) {
    return <Text style={styles.cellText}>{formatNumber(cell)}</Text>;
  }

  return <Text style={styles.cellText}>{cell}</Text>;
};

export const renderHealthBenefitCell = (cell, rowIndex, colIndex, row) => (
  <HealthBenefitCell cell={cell} rowIndex={rowIndex} colIndex={colIndex} row={row} />
);

const HealthBenefitCell = ({ cell, rowIndex, colIndex, row }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  if (cell === undefined || cell === null) {
    return <Text style={[styles.cellText, styles.notApplicableText]}>-</Text>;
  }

  // If cell is ✕, show not covered
  if (cell === '✕') {
    return <Text style={[styles.cellText, styles.notCoveredIcon]}>✕</Text>;
  }

  // Handle "Covered" text
  if (cell === 'Covered') {
    return (
      <Text style={[styles.cellText, styles.applicableText]}>Covered</Text>
    );
  }

  // If cell contains HTML tags, strip them
  if (typeof cell === 'string' && (cell.includes('<') || cell.includes('>'))) {
    const cleanText = stripHtmlTags(cell);

    // Check if it's a simple covered message
    if (cleanText.toLowerCase().includes('covered') && cleanText.length < 50) {
      return (
        <Text
          style={[styles.cellText, styles.applicableText]}
        // numberOfLines={2}
        >
          {cleanText}
        </Text>
      );
    }

    // For longer descriptions
    return (
      <Text style={[styles.healthBenefitText]} /* numberOfLines={4} */>
        {cleanText}
      </Text>
    );
  }

  // Handle AED amounts
  if (typeof cell === 'string' && cell.includes('AED')) {
    return <Text style={styles.cellText}>{cell}</Text>;
  }

  // Handle percentage co-pay
  if (typeof cell === 'string' && cell.includes('%')) {
    return <Text style={styles.cellText}>{cell}</Text>;
  }

  // Handle "Not Covered"
  if (
    typeof cell === 'string' &&
    (cell.toLowerCase().includes('not covered') || cell.toLowerCase() === 'no')
  ) {
    return (
      <Text style={[styles.cellText, styles.notApplicableText]}>
        Not Covered
      </Text>
    );
  }

  // Default case - show the text
  return (
    <Text style={styles.cellText} numberOfLines={3}>
      {cell}
    </Text>
  );
};

const style = theme =>
  StyleSheet.create({
    cellText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    healthBenefitText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    applicableText: {
      color: theme.colors.lableText,
    },
    notApplicableText: {
      color: theme.colors.red,
    },
    notCoveredIcon: {
      fontSize: verticalScale(16),
      color: theme.colors.red,
      fontFamily: 'Lato-Bold',
    },
    priceText: {
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
    warningText: {
      color: theme.colors.lableThirdText,
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
  });

export default {
  // Motor Insurance
  renderComparisonCell,
  renderCoverageCell,
  renderBenefitCell,
  // Health Insurance
  renderHealthComparisonCell,
  renderHealthBenefitCell,
  // Utilities
  isNumber,
  stripHtmlTags,
};
