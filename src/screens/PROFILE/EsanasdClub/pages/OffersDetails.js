import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Header from '@components/ui/Header';
import CustomButton from '@components/ui/CustomButton';
import { useGetPartnerOffers } from '@hooks/profile/useProfile';
import { env } from '@config/index';
import AvilModalOtp from '../components/AvilModalOtp';

const OffersDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useThemeContext();
  const styles = Style(theme);

  const partnerId = route?.params?.partnerId;

  const { data: partnerOffersDetails = [] } = useGetPartnerOffers({
    id: partnerId,
  });

  const partner = partnerOffersDetails?.[0]?.partner ?? {};

  const [currentOffer, setCurrentOffer] = useState(null);
  const [showCard, setShowCard] = useState(false);

  const openOfferModal = useCallback(offer => {
    setCurrentOffer(offer);
    setShowCard(true);
  }, []);

  const renderOfferCard = ({ item }) => {
    const { discountType, discountValue, discountTitle, termsNConditions } =
      item;

    const discountLabel =
      discountType === 'percentage'
        ? `${discountValue}%`
        : `${discountValue} AED`;

    return (
      <View style={styles.offerCard}>
        <Text style={styles.discountText}>{discountLabel} OFF</Text>

        <Text style={styles.discountTitle}>{discountTitle}</Text>

        <CustomButton
          title="Avail"
          onPress={() => openOfferModal(item)}
          buttonStyle={styles.availButton}
          textStyle={{ fontSize: verticalScale(16) }}
        />

        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          <Text style={styles.termsText}>{termsNConditions}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => {
    if (!partner?.companyName) return null;

    const coverImg = partner?.coverImg?.path
      ? `${env.API_URL}/${partner.coverImg.path}`
      : null;

    const logoImg = partner?.logoImg?.path
      ? `${env.API_URL}/${partner.logoImg.path}`
      : null;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.imageContainer}>
          {coverImg && (
            <Image
              source={{ uri: coverImg }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}

          {logoImg && (
            <Image
              source={{ uri: logoImg }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.companyName}>{partner.companyName}</Text>
        </View>

        <View style={styles.metaRow}>
          {partner?.locations?.map((location, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              style={styles.locationContainer}
            >
              <Icon
                name="location-on"
                size={16}
                color={theme.colors.description}
              />
              <Text numberOfLines={1} style={styles.locationText}>
                {location?.location}
              </Text>
            </TouchableOpacity>
          ))}

          {partner?.category && (
            <Text style={styles.categoryText}>{partner.category}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      style={styles.container}
    >
      <Header title="Partner Detail" onBack={navigation.goBack} />

      <FlatList
        data={partnerOffersDetails}
        renderItem={renderOfferCard}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />

      {showCard && (
        <AvilModalOtp
          currentOffer={currentOffer}
          isInput
          handleClose={() => setShowCard(false)}
        />
      )}
    </LinearGradient>
  );
};

export default OffersDetails;

const Style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    listContentContainer: {
      padding: verticalScale(20),
      paddingBottom: verticalScale(40),
      gap: verticalScale(10),
    },
    headerContainer: {
      marginBottom: verticalScale(10),
    },
    imageContainer: {
      backgroundColor: theme.colors.floorBgColor,
      borderRadius: verticalScale(10),
      overflow: 'hidden',
    },
    coverImage: {
      width: '100%',
      height: verticalScale(283),
    },
    logoImage: {
      position: 'absolute',
      bottom: verticalScale(20),
      left: verticalScale(25),
      width: verticalScale(100),
      height: verticalScale(100),
      borderRadius: verticalScale(10),
    },
    detailsContainer: {
      marginTop: verticalScale(20),
      marginBottom: verticalScale(10),
    },
    companyName: {
      color: theme.colors.primary,
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(5),
      flex: 1,
    },
    locationText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      width: '75%',
    },
    categoryText: {
      color: theme.colors.lableText,
      fontSize: verticalScale(14),
      backgroundColor: theme.colors.lableBg,
      padding: verticalScale(5),
      borderRadius: verticalScale(4),
    },
    offerCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(16),
      padding: verticalScale(16),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    discountText: {
      fontSize: verticalScale(16),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(8),
    },
    discountTitle: {
      fontSize: verticalScale(16),
      color: theme.colors.description,
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(15),
      lineHeight: verticalScale(22),
    },
    availButton: {
      width: '30%',
      height: verticalScale(40),
      marginBottom: verticalScale(12),
    },
    termsContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: verticalScale(8),
    },
    termsTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
      marginBottom: verticalScale(5),
    },
    termsText: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      lineHeight: verticalScale(18),
    },
  });
