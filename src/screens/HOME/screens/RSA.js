import React from 'react';
import { useThemeContext } from '@theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Text, View, FlatList, Linking, Image } from 'react-native';
import Header from '@components/ui/Header';
import { useGetactivepolicy } from '@hooks/home/useHomeFlow';
import moment from 'moment';
import { verticalScale } from '@constants/metrics';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { Link } from '@react-navigation/native';
import { env } from '@config/index';
import NoData from '@components/ui/NoData';

const RSA = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { data: activePolicy = [] } = useGetactivepolicy();

  console.log('`activePolicy`', activePolicy);

  const renderPolicyItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        Linking.openURL(
          `tel:${item?.currentCompany?.motorInsurance?.roadSiteAssistNo}`,
        )
      }
      style={styles.policyCard}
    >
      <Icon
        name="phone"
        size={20}
        color={theme.colors.primary}
        style={styles.icon}
      />
      <View style={{ gap: verticalScale(5) }}>
        <Text style={styles.policyNumber}>
          {`${item?.carId?.year}, ${item?.carId?.make}, ${item?.carId?.model}`}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Image
            source={{ uri: env.API_URL + item?.currentCompany?.logoImg?.path }}
            style={styles.companyLogo}
          />
          <Text style={styles.companyName}>
            {`${item?.currentCompany?.companyName}`}
          </Text>
        </View>
        <Text style={styles.status}>{`Policy : ${
          item?.policyEffectiveDate && item?.policyExpiryDate
            ? `${moment(item?.policyEffectiveDate).format(
                'DD/MM/YYYY',
              )} - ${moment(item?.policyEffectiveDate).format('DD/MM/YYYY')}`
            : '-'
        }`}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <NoData />
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.gradientContainer}
    >
      <Header
        title={'Road Side Assistance'}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={activePolicy?.data || []}
        renderItem={renderPolicyItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default RSA;

const style = theme =>
  StyleSheet.create({
    gradientContainer: {
      flex: 1,
    },
    listContainer: {
      padding: verticalScale(20),
      paddingBottom: verticalScale(40),
      gap: verticalScale(15),
      flexGrow: 1,
    },
    policyCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    icon: {
      backgroundColor: theme.colors.floorBgColor,
      padding: 10,
      borderRadius: 40,
      alignSelf: 'flex-start',
    },
    policyNumber: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    companyName: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    status: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      marginBottom: 4,
    },
    totalPrice: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.success,
      marginBottom: 4,
    },
    dates: {
      fontSize: verticalScale(12),
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    companyLogo: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
  });
