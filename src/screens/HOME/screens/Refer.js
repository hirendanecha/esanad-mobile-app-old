import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Share from 'react-native-share';
import { useThemeContext } from '@theme/ThemeProvider';
import { useAuthStore } from '@store/authStore';
import { verticalScale } from '@constants/metrics';
import { Back } from '@assets/index';
import HomeHeader from '@screens/HOME/components/HomeHeader';
import CustomButton from '@components/ui/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Header from '@components/ui/Header';
import { SCREEN_NAMES } from '@constants/screenNames';

const Refer = () => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const onShare = async () => {
    try {
      const referralCode = (user?.referralCode || 'ESANAD2360').toUpperCase();
      const shareOptions = {
        title: 'Share Referral Code',
        message: `Hey! Use my referral code ${referralCode} to get a voucher for AED 50 when you sign up for eSanad! Download the app now: https://esanad.com`,
      };
      const result = await Share.open(shareOptions);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Invite Friends" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={Back.Refer}
          style={styles.heroContainer}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.balanceCard}>
            <Text style={styles.cardTitle}>CURRENT POINTS BALANCE</Text>
            <Text style={styles.pointsLabel}>Total Points: 0</Text>
            <Text style={styles.valueLabel}>Points Value in AED: 0</Text>
          </View>
        </ImageBackground>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(SCREEN_NAMES.TERMS_AND_CONDITIONS)
            }
          >
            <Text style={styles.linkText}>Terms and Conditions</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.linkText}>Referal Code Statement</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Send Invitation"
            isShowIcon={true}
            buttonStyle={styles.inviteButton}
            textStyle={styles.inviteButtonText}
            onPress={onShare}
            UniqueCode
          />
          <Text style={styles.infoText}>
            Get your family and friends a voucher for AED 50 by sharing your
            unique code with them.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Refer;

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: verticalScale(30),
    },
    heroContainer: {
      width: '100%',
      height: verticalScale(460),
      justifyContent: 'flex-end',
    },
    heroImageStyle: {
      borderBottomLeftRadius: verticalScale(40),
      borderBottomRightRadius: verticalScale(40),
    },
    heroContent: {
      paddingHorizontal: verticalScale(25),
      paddingTop: verticalScale(40),
    },
    welcomeText: {
      fontSize: verticalScale(22),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textSecondary,
    },
    brandText: {
      fontSize: verticalScale(28),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textSecondary,
      marginTop: verticalScale(2),
    },
    peoplePlaceholder: {
      width: '100%',
      height: verticalScale(250),
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    peopleImage: {
      width: '100%',
      height: '100%',
    },
    cardContainer: {
      paddingHorizontal: verticalScale(20),
      marginTop: -verticalScale(60),
    },
    balanceCard: {
      backgroundColor: theme.colors.highlight,
      borderRadius: verticalScale(20),
      paddingVertical: verticalScale(25),
      paddingHorizontal: verticalScale(20),
      alignItems: 'center',
      margin: verticalScale(20),
      borderWidth: 1,
      borderColor: theme.colors.backgroundColor,
    },
    cardTitle: {
      fontSize: verticalScale(24),
      fontFamily: 'Lato-Black',
      color: theme.colors.text,
      marginBottom: verticalScale(15),
    },
    pointsLabel: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginBottom: verticalScale(5),
    },
    valueLabel: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    linksContainer: {
      alignItems: 'center',
      marginTop: verticalScale(30),
      gap: verticalScale(10),
    },
    linkText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    buttonContainer: {
      paddingHorizontal: verticalScale(20),
      marginTop: verticalScale(80),
      alignItems: 'center',
    },
    inviteButton: {
      backgroundColor: theme.colors.highlight,
      width: '100%',
      height: verticalScale(55),
      borderRadius: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    inviteButtonText: {
      fontSize: verticalScale(18),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    infoText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: verticalScale(20),
      lineHeight: verticalScale(20),
    },
  });
