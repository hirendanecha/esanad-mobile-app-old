import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatNumber } from '@utils/formateNumber';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useThemeContext } from '@theme/ThemeProvider';
import ComparisonCarousel from './components/ComparisonCarousel';
import { useHealthStore } from '@store/HEALTH/healthStore';
import Header from '@components/ui/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGenerateplancomparepdf } from '@hooks/HEALTH/healthFlow/useHealthFlow';
import { verticalScale } from '@constants/metrics';

const HealthInsuranceComparisonScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { compareHealthPolicy } = useHealthStore();
  const compareCompaniesData = compareHealthPolicy;

  const { mutate: compareQuotesDownload } = useGenerateplancomparepdf();

  const handleBuyNowPress = quoteId => {
    if (quoteId) {
      navigation.navigate(SCREEN_NAMES.HEALTH_INSURANCE_DETAILS, {
        policy_id: quoteId,
      });
    }
  };

  const handleDownloadPDF = () => {
    let ids = [];
    compareCompaniesData?.map(item => {
      ids?.push(item?._id);
    });

    console.log('ids', ids);

    compareQuotesDownload({
      data: { ids },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Compare Plans Table"
        onBack={() => navigation.goBack()}
        download
        onDownload={() => handleDownloadPDF()}
      />

      <ComparisonCarousel
        compareCompaniesData={compareCompaniesData}
        onBuyNowPress={handleBuyNowPress}
        formatNumber={formatNumber}
      />
    </View>
  );
};

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    backText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    pdfButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(8),
      justifyContent: 'flex-end',
    },
    pdfText: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.primary,
    },
    scrollHint: {
      padding: 8,
      backgroundColor: theme.colors.backgroundColor,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
    },
  });

export default HealthInsuranceComparisonScreen;
