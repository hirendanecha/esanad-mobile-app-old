// InsuranceComparisonScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { formatNumber } from '@utils/formateNumber';
import { usePolicyStore } from '@store/MOTOR/policyStore';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useThemeContext } from '@theme/ThemeProvider';
import Header from '@components/ui/Header';
import { useCompareQuotesDownload } from '@hooks/policy/useMotorPolicy';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import MotorComparisonCarousel from './components/MotorComparisonCarousel';

const InsuranceComparisonScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { compareRefID } = useMotorDetalisStore();

  const { comparePolicy } = usePolicyStore();
  const compareCompaniesData = comparePolicy;

  const { mutate: compareQuotesDownload } = useCompareQuotesDownload();

  const handleBuyNowPress = quoteId => {
    if (quoteId) {
      navigation.navigate(SCREEN_NAMES.POLICY_DETAIL_SCREEN, {
        policy_id: quoteId,
      });
    }
  };

  const handleDownloadPDF = () => {
    let ids = [];
    compareCompaniesData?.data?.map(item => {
      ids?.push(item?._id);
    });

    compareQuotesDownload({
      refId: compareRefID,
      data: { ids },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Compare Plans"
        onBack={() => navigation.goBack()}
        download
        onDownload={() => handleDownloadPDF()}
      />

      <MotorComparisonCarousel
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
  });

export default InsuranceComparisonScreen;
