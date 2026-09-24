import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Header from '@components/ui/Header';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import ExchangeRateService from '@api/services/ExchangeRateService';
import AppLoaderLocal from '@components/ui/AppLoaderLocal';

const COMMON_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'PKR',
  'PHP',
  'EGP',
  'SAR',
  'OMR',
  'KWD',
  'BHD',
  'JOD',
];

const ExchangeRateScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('1');

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await ExchangeRateService.getLatestRates('AED');
      setData(res);
      setLoading(false);
    } catch (err) {
      console.log('Error fetching rates:', err);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRates();
      return () => { };
    }, []),
  );

  const getConvertedValue = rate => {
    const num = parseFloat(amount) || 0;
    return (num * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };



  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={{ flex: 1 }}
    >
      <Header title="Exchange Rate" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ padding: verticalScale(20) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Input Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.backgroundColor,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <FloatingLabelInput
            label="Amount in AED"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            customStyle={{ fontSize: verticalScale(18), fontWeight: 'bold' }}
          />
        </View>

        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Live Conversion (1 AED = )
        </Text>

        {data &&
          COMMON_CURRENCIES.map(code => {
            const rate = data.conversion_rates[code];
            if (!rate) return null;
            return (
              <View
                key={code}
                style={[
                  styles.rateItem,
                  {
                    backgroundColor: theme.colors.backgroundColor,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.currencyInfo}>
                  <Text
                    style={[
                      styles.rateCode,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    {code}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textTertiary,
                      fontSize: verticalScale(12),
                    }}
                  >
                    {code} Exchange Rate
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[styles.rateValue, { color: theme.colors.primary }]}
                  >
                    {getConvertedValue(rate)}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textTertiary,
                      fontSize: verticalScale(10),
                    }}
                  >
                    Rate: {rate.toFixed(4)}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
      {loading && <AppLoaderLocal />}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    borderRadius: verticalScale(15),
    padding: verticalScale(15),
    marginBottom: verticalScale(25),
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(15),
    fontFamily: 'Lato-Bold',
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: verticalScale(15),
    borderRadius: verticalScale(12),
    marginBottom: verticalScale(10),
    borderWidth: 1,
  },
  currencyInfo: { flex: 1 },
  rateCode: {
    fontSize: verticalScale(18),
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  rateValue: {
    fontSize: verticalScale(18),
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontSize: verticalScale(12),
    fontFamily: 'Lato-Regular',
  },
});

export default ExchangeRateScreen;
