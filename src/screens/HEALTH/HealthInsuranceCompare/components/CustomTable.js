import { env } from '@config/index';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const CustomTable = ({
  compareCompaniesData,
  onBuyNowPress,
  onCellPress,
  renderCell,
  formatNumber,
  CellRendererUtils,
}) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const horizontalScrollRef = useRef(null);

  console.log('compareCompaniesData', compareCompaniesData);

  const prepareHeaders = () => {
    if (!compareCompaniesData) return [];
    return [
      '',
      ...compareCompaniesData.map(
        item => item?.companyData?.companyName || 'Company',
      ),
    ];
  };

  const prepareBasicTableData = () => {
    if (!compareCompaniesData) return [];

    const rows = [
      {
        label: 'Premium (Excl. VAT)',
        values: compareCompaniesData.map(item =>
          item.isReferral
            ? 'Contact us for price'
            : item.isPremiumRequestUpon
            ? 'Price upon request'
            : `AED ${formatNumber(item.price)}`,
        ),
        hasTooltip: true,
        tooltipContent: 'Original price by insurance companies',
      },
    ];

    // Add Self/Owner row if exists
    if (compareCompaniesData[0]?.owner?.length > 0) {
      rows.push({
        label: `Self (${compareCompaniesData[0]?.owner?.[0]?.person?.fullName})`,
        values: compareCompaniesData.map(item => {
          const owner = item.owner?.[0];
          return item.isReferral
            ? 'Contact us for price'
            : item.isPremiumRequestUpon
            ? 'Price upon request'
            : `AED ${formatNumber(owner?.premium + (owner?.loadSum || 0))}`;
        }),
        hasTooltip: true,
        tooltipContent: 'Self',
      });
    }

    // Add Spouse row if exists
    if (compareCompaniesData[0]?.spouse?.length > 0) {
      rows.push({
        label: `Spouse (${compareCompaniesData[0]?.spouse?.[0]?.person?.fullName})`,
        values: compareCompaniesData.map(item => {
          const spouse = item.spouse?.[0];
          return item.isReferral
            ? 'Contact us for price'
            : item.isPremiumRequestUpon
            ? 'Price upon request'
            : `AED ${formatNumber(spouse?.premium + (spouse?.loadSum || 0))}`;
        }),
        hasTooltip: true,
        tooltipContent: 'Spouse',
      });
    }

    // Add Kids rows if exist
    if (compareCompaniesData[0]?.kids?.length > 0) {
      compareCompaniesData[0].kids.forEach((kid, idx) => {
        rows.push({
          label: `Kids (${kid?.person?.fullName})`,
          values: compareCompaniesData.map(item => {
            const childData = item.kids?.[idx];
            return item.isReferral
              ? 'Contact us for price'
              : item.isPremiumRequestUpon
              ? 'Price upon request'
              : `AED ${formatNumber(
                  childData?.premium + (childData?.loadSum || 0),
                )}`;
          }),
          hasTooltip: true,
          tooltipContent: 'Kids',
        });
      });
    }

    return rows;
  };

  const prepareBenefitsData = () => {
    if (!compareCompaniesData) return [];

    // Collect all unique benefits from all quotes
    const benefitsMap = new Map();

    compareCompaniesData.forEach(quote => {
      const allCovers = [
        ...(quote?.includedCovers || []),
        ...(quote?.extraCovers || []),
      ];

      allCovers.forEach(cover => {
        if (cover?.benefit?._id && !benefitsMap.has(cover.benefit._id)) {
          benefitsMap.set(cover.benefit._id, {
            benefit: cover.benefit,
            priority: cover.benefit?.priority || 999,
          });
        }
      });
    });

    // Sort by priority
    const sortedBenefits = Array.from(benefitsMap.values()).sort((a, b) => {
      const priorityA = a.priority;
      const priorityB = b.priority;
      if (priorityA === undefined && priorityB === undefined) return 0;
      if (priorityA === undefined) return 1;
      if (priorityB === undefined) return -1;
      return priorityA - priorityB;
    });

    // Map benefits to table rows
    return sortedBenefits.map(({ benefit }) => ({
      label: benefit.name,
      benefitId: benefit._id,
      values: compareCompaniesData.map(quote => {
        const match = [
          ...(quote?.includedCovers || []),
          ...(quote?.extraCovers || []),
        ].find(cover => cover?.benefit?._id === benefit._id);

        if (!match?.isEnabled) {
          return '✕';
        }

        // Handle object type benefits (most common in health insurance)
        if (match?.benefit?.valueType === 'object') {
          const dataObj =
            match?.coverage ||
            match?.coPay ||
            match?.deductible ||
            match?.detail ||
            {};
          return dataObj.description || 'Covered';
        }

        // Handle simple value types
        if (match?.value) {
          return match.value;
        }

        if (match?.limitAmount && match.limitAmount !== 0) {
          return `AED ${formatNumber(match.limitAmount)}`;
        }

        return 'Covered';
      }),
      hasTooltip: true,
      tooltipContent: benefit.description || benefit.name,
      type: 'benefit',
    }));
  };

  const headers = prepareHeaders();
  const basicData = prepareBasicTableData();
  const benefitsData = prepareBenefitsData();

  const firstColumnWidth = 200;
  const regularColumnWidth = 150;
  const numberOfRegularColumns = headers.length - 1;
  const exactTableWidth =
    firstColumnWidth + numberOfRegularColumns * regularColumnWidth;

  const renderCompanyHeader = () => {
    if (!compareCompaniesData?.length) return null;

    return (
      <View style={styles.companyHeaderContainer}>
        <View style={styles.companyHeaderRow}>
          <View style={[styles.companyCell, styles.companyCellHeader]}>
            <Text style={styles.companyHeaderText}>
              Compare and{'\n'}Save Big!
            </Text>
          </View>

          {compareCompaniesData?.map((item, index) => (
            <View key={index} style={styles.companyCell}>
              <Image
                source={{
                  uri: item.companyData?.logoImg
                    ? `${env.API_URL}${item.companyData.logoImg.path}`
                    : 'https://via.placeholder.com/75x75/cccccc/666666?text=Logo',
                }}
                style={styles.companyLogo}
                resizeMode="contain"
              />
              <Text style={styles.companyName} numberOfLines={2}>
                {item.companyData?.companyName}
              </Text>

              <TouchableOpacity
                style={styles.buyNowButton}
                onPress={() => onBuyNowPress && onBuyNowPress(item._id)}
              >
                <Text style={styles.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {icon} {title}
      </Text>
    </View>
  );

  const renderDataRows = (data, type = 'basic') => {
    return data.map((row, rowIndex) => (
      <View
        key={rowIndex}
        style={[
          styles.dataRow,
          rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
        ]}
      >
        <View
          style={[
            styles.cell,
            styles.firstColumnCell,
            rowIndex % 2 === 0
              ? {
                  backgroundColor: theme.colors.backgroundColor,
                }
              : {
                  backgroundColor: theme.colors.bgSecondary,
                },
          ]}
        >
          <TouchableOpacity
            style={styles.cellTouchable}
            onPress={() =>
              onCellPress && onCellPress(rowIndex, 0, row.label, type)
            }
          >
            <Text style={styles.firstColumnText}>{row.label}</Text>
          </TouchableOpacity>
        </View>

        {row.values?.map((cell, colIndex) => (
          <View key={colIndex} style={styles.cell}>
            <TouchableOpacity
              style={styles.cellTouchable}
              onPress={() =>
                onCellPress && onCellPress(rowIndex, colIndex + 1, cell, type)
              }
            >
              {renderCell && CellRendererUtils ? (
                type === 'benefit' ? (
                  CellRendererUtils.renderHealthBenefitCell(
                    cell,
                    rowIndex,
                    colIndex,
                    row,
                  )
                ) : (
                  CellRendererUtils.renderHealthComparisonCell(
                    cell,
                    rowIndex,
                    colIndex,
                    row,
                  )
                )
              ) : (
                <Text style={styles.cellText}>{cell}</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 30,
        flexDirection: 'column',
      }}
      stickyHeaderIndices={[0]}
      horizontal
    >
      {renderCompanyHeader()}
      <ScrollView
        ref={horizontalScrollRef}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={[styles.table, { width: exactTableWidth }]}>
          {renderDataRows(basicData, 'basic')}

          {benefitsData.length > 0 && renderDataRows(benefitsData, 'benefit')}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const style = theme =>
  StyleSheet.create({
    tableContainer: {
      backgroundColor: theme.colors.backgroundColor,
    },
    table: {
      backgroundColor: theme.colors.backgroundColor,
    },
    sectionHeader: {
      backgroundColor: theme.colors.border,
      padding: verticalScale(16),
      width: '100%',
    },
    sectionHeaderText: {
      fontSize: verticalScale(16),
      textAlign: 'center',
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    companyHeaderContainer: {
      backgroundColor: theme.colors.backgroundColor,
      borderBottomColor: theme.colors.border,
      marginBottom: 0,
      height: 130,
    },
    companyHeaderRow: {
      flexDirection: 'row',
      height: 130,
    },
    companyCell: {
      width: 180,
      minHeight: 120,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundColor,
    },
    companyCellHeader: {
      justifyContent: 'center',
      width: 200,
    },
    companyHeaderText: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      textAlign: 'center',
      color: theme.colors.text,
    },
    companyContent: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    companyLogo: {
      width: 75,
      height: 55,
      marginBottom: 8,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: 4,
    },
    companyName: {
      fontSize: verticalScale(12),
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 14,
      fontFamily: 'Lato-Regular',
    },
    buyNowButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
      marginTop: 8,
      minWidth: 80,
    },
    buyNowText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
    dataRow: {
      flexDirection: 'row',
    },
    evenRow: {
      backgroundColor: theme.colors.backgroundColor,
    },
    oddRow: {
      backgroundColor: theme.colors.border + '40',
    },
    cell: {
      width: 180,
      minHeight: 50,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    firstColumnCell: {
      width: 200,
      backgroundColor: theme.colors.floorBgColor,
    },
    cellTouchable: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
    },
    firstColumnText: {
      marginHorizontal: verticalScale(10),
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    cellText: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      color: theme.colors.text,
    },
  });

export default CustomTable;
