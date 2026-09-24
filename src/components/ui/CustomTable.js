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
  Platform,
} from 'react-native';

const CustomTable = ({
  compareCompaniesData,
  onCompanyPress,
  onBuyNowPress,
  onCellPress,
  renderCell,
  formatNumber,
  CellRendererUtils,
}) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const horizontalScrollRef = useRef(null);

  const prepareHeaders = () => {
    if (!compareCompaniesData?.data) return [];
    return [
      '',
      ...compareCompaniesData.data.map(
        item => item.QuatationCompanyName || 'Company',
      ),
    ];
  };

  const prepareBasicTableData = () => {
    if (!compareCompaniesData?.data) return [];

    return [
      {
        label: 'Premium (Excl. VAT)',
        values: compareCompaniesData.data.map(item =>
          item.quoteInfo?.isWithoutMatrixOrApi
            ? 'Ask for price'
            : item.quoteInfo?.discountPrice !== 0
            ? `AED ${formatNumber(
                parseInt(item.quoteInfo.discountPrice * 100) / 100,
              )}`
            : `AED ${formatNumber(
                parseInt(item.quoteInfo.totalPrice * 100) / 100,
              )}`,
        ),
        hasTooltip: true,
        tooltipContent:
          'A premium is the sum paid by someone to an insurance company for coverage.',
        tooltipUrl: 'https://sh.esanad.com/the-premium/',
      },
      {
        label: 'Sum Insured (Vehicle Value)',
        values: compareCompaniesData.data.map(item =>
          item.insuranceType === 'comprehensive' && item.quoteInfo?.sumInsured
            ? `AED ${formatNumber(item.quoteInfo.sumInsured)}`
            : '-',
        ),
      },
      {
        label: 'Type',
        values: compareCompaniesData.data.map(item =>
          item.insuranceType === 'thirdparty'
            ? 'Third Party'
            : item.insuranceType,
        ),
      },
      {
        label: 'Excess',
        values: compareCompaniesData.data.map(item => {
          if (
            item.quoteInfo?.isWithoutMatrixOrApi ||
            item.insuranceType === 'thirdparty'
          ) {
            return '-';
          }
          const excessAmount = item.Offers?.[0]?.ExcessAmount;
          if (excessAmount === 0) return '✕';
          if (!excessAmount) return '-';
          return `AED ${formatNumber(excessAmount)}`;
        }),
      },
      {
        label: 'Takaful Insurance',
        values: compareCompaniesData.data.map(item =>
          item.company?.isTakaful === true ? 'Yes' : 'No',
        ),
      },
    ];
  };

  const prepareCoverageData = () => {
    if (!compareCompaniesData?.coverages) return [];
    return compareCompaniesData.coverages.map(coverage => ({
      label: coverage.Title,
      values: coverage.values,
      hasTooltip: true,
      tooltipContent: coverage.coverageDetail?.description || coverage.Title,
      tooltipUrl: coverage.coverageDetail?.url,
      carValues: coverage.carValues,
      type: 'coverage',
    }));
  };

  const prepareBenefitsData = () => {
    if (!compareCompaniesData?.benefits) return [];
    return compareCompaniesData.benefits.map(benefit => ({
      label: benefit.Title,
      values: benefit.values,
      hasTooltip: true,
      tooltipContent: benefit.benifitDetail?.description || benefit.Title,
      tooltipUrl: benefit.benifitDetail?.url,
      limitValues: benefit.limitValues,
      type: 'benefit',
    }));
  };

  const headers = prepareHeaders();
  const basicData = prepareBasicTableData();
  const coverageData = prepareCoverageData();
  const benefitsData = prepareBenefitsData();

  const firstColumnWidth = 200;
  const regularColumnWidth = 180;
  const numberOfRegularColumns = headers.length - 1;
  const exactTableWidth =
    firstColumnWidth + numberOfRegularColumns * regularColumnWidth;

  const renderCompanyHeader = () => {
    if (!compareCompaniesData?.data?.length) return null;

    return (
      <View style={styles.companyHeaderContainer}>
        <View style={styles.companyHeaderRow}>
          <View style={[styles.companyCell, styles.companyCellHeader]}>
            <Text style={styles.companyHeaderText}>
              Compare and{'\n'}Save Big!
            </Text>
          </View>

          {compareCompaniesData.data.map((item, index) => (
            <View key={index} style={styles.companyCell}>
              <Image
                source={{
                  uri: item.company?.logoImg
                    ? `${env.API_URL}${item.company.logoImg.path}`
                    : 'https://via.placeholder.com/75x75/cccccc/666666?text=Logo',
                }}
                style={styles.companyLogo}
                resizeMode="contain"
              />
              <Text style={styles.companyName} numberOfLines={2}>
                {item.QuatationCompanyName}
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
                type === 'coverage' ? (
                  CellRendererUtils.renderCoverageCell(
                    cell,
                    rowIndex,
                    colIndex,
                    row,
                  )
                ) : type === 'benefit' ? (
                  CellRendererUtils.renderBenefitCell(
                    cell,
                    rowIndex,
                    colIndex,
                    row,
                  )
                ) : (
                  CellRendererUtils.renderComparisonCell(
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

          {coverageData.length > 0 && (
            <>
              {renderSectionHeader('Coverages Guide', '📋')}
              {renderDataRows(coverageData, 'coverage')}
            </>
          )}

          {benefitsData.length > 0 && (
            <>
              {renderSectionHeader('Benefits Guide', '🎁')}
              {renderDataRows(benefitsData, 'benefit')}
            </>
          )}
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
