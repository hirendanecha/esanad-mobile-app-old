import React, { memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '@components/ui/Header';
import CustomButton from '@components/ui/CustomButton';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';
import { getBottomMargin } from '@utils/paddingBottom';

const InfoCard = ({ icon, title, text }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <View style={styles.infoIcon}>
          <Icon
            name={icon}
            size={verticalScale(24)}
            color={theme.colors.textSecondary}
          />
        </View>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>

      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
};

const AboutUs = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const styles = getStyles(theme);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="About eSanad" showBackButton onBack={navigation.goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: getBottomMargin(),
          },
        ]}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroImageWrapper}>
            <Image
              source={Images.aboutUs}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heroTitle}>About eSanad</Text>

          <Text style={styles.heroText}>
            eSanad Insurance, where we're using digital innovation to make
            insurance simpler and more transparent for people and businesses.
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </View>

        <InfoCard
          icon="book"
          title="Our Story"
          text="eSanad was founded when our founder, Anas Mistareehi, recognized the need for modernized insurance, embracing technology as a catalyst for transformation."
        />

        <InfoCard
          icon="flag"
          title="Our Mission"
          text="Empowering the Future of Insurance by driving a new era of insurance excellence."
        />

        <InfoCard
          icon="visibility"
          title="Our Vision"
          text="To simplify and enhance customer insurance experiences that protect and add real value."
        />

        <InfoCard
          icon="school"
          title="Our Expertise"
          text="Our team consists of highly skilled insurance professionals delivering innovative e-insurance solutions."
        />

        <LinearGradient
          colors={[theme.colors.linear1, theme.colors.linear2]}
          style={styles.ceoHeader}
        >
          <Image
            source={Images.anus}
            style={styles.ceoImage}
            resizeMode="contain"
          />
        </LinearGradient>

        <Text style={styles.ceoName}>Anas Mistareehi</Text>

        <Text style={styles.ceoDescription}>
          Our CEO holds over 20 years of leadership experience in the insurance
          industry, having worked with AXA, Al Wathba, and ADNIC. His passion
          for technology continues to shape the future of eSanad.
        </Text>

        <LinearGradient
          colors={[theme.colors.linear1, theme.colors.linear2]}
          style={styles.ctaCard}
        >
          <View style={styles.ctaContent}>
            <View style={styles.ctaIcon}>
              <Image
                source={Images.support}
                style={styles.ctaIconImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.ctaTitle}>
              Need Assistance? We’re Here for you!
            </Text>

            <Text style={styles.ctaText}>
              Our team is always ready to guide you through your insurance
              journey with ease and professionalism.
            </Text>

            <CustomButton
              title="Ask eSanad"
              type="secondary"
              isShowIcon
              buttonStyle={styles.ctaButton}
              textStyle={styles.ctaButtonText}
              onPress={() => navigation.navigate('ContactUs')}
            />
          </View>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {},
    heroSection: {
      margin: verticalScale(20),
    },
    heroImageWrapper: {
      height: verticalScale(270),
      marginBottom: verticalScale(16),
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      marginBottom: verticalScale(8),
    },
    heroText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      lineHeight: verticalScale(20),
    },
    infoCard: {
      marginHorizontal: verticalScale(20),
      marginBottom: verticalScale(15),
      padding: verticalScale(15),
      borderRadius: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(10),
    },
    infoIcon: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: verticalScale(20),
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: verticalScale(10),
    },
    infoTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    infoText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      lineHeight: verticalScale(18),
    },

    ceoHeader: {
      height: Dimensions.get('screen').width - 60,
      marginHorizontal: verticalScale(20),
      borderRadius: verticalScale(15),
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    ceoImage: {
      width: '95%',
      height: '92%',
    },
    ceoName: {
      marginHorizontal: verticalScale(20),
      marginTop: verticalScale(10),
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    ceoDescription: {
      marginHorizontal: verticalScale(20),
      marginVertical: verticalScale(12),
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      lineHeight: verticalScale(20),
    },
    ctaCard: {
      marginHorizontal: verticalScale(20),
      borderRadius: verticalScale(16),
    },
    ctaContent: {
      padding: verticalScale(24),
      alignItems: 'center',
    },
    ctaIcon: {
      width: verticalScale(40),
      height: verticalScale(40),
      marginBottom: verticalScale(8),
    },
    ctaIconImage: {
      width: '100%',
      height: '100%',
      tintColor: theme.colors.backgroundColor,
    },
    ctaTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textSecondary,
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    ctaText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: verticalScale(20),
    },
    ctaButton: {
      width: '70%',
      borderRadius: verticalScale(12),
      justifyContent: 'center',
    },
    ctaButtonText: {
      fontSize: verticalScale(16),
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });

export default AboutUs;
