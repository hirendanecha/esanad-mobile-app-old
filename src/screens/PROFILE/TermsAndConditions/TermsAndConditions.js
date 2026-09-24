import React, { memo } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { verticalScale, moderateScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Header from '@components/ui/Header';
import { ACCOUNT_JSON } from '@constants/Static/AccountJson';
import LinearGradient from 'react-native-linear-gradient';

const EMAILS = {
  MAIN: 'hello@esanad.com',
  INFO: 'info@esanad.com',
};

const CONTACT = {
  PHONE: '025623630',
  ADDRESS: 'M2, Al Saqer Al Baraka Building, Abu Dhabi, UAE',
};

const TermsAndConditions = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const styles = createStyles(theme);

  const handleLinkPress = (type, value) => {
    const prefix = type === 'email' ? 'mailto:' : 'tel:';
    Linking.openURL(`${prefix}${value}`);
  };

  const SectionCard = memo(({ section, renderContactInfo }) => {
    const { theme } = useThemeContext();
    const styles = createStyles(theme);

    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionContent}>
          {section.content}
          {renderContactInfo(section.id)}
        </Text>
      </View>
    );
  });

  const renderContactInfo = sectionId => {
    switch (sectionId) {
      case 20:
        return (
          <Text style={styles.contactInfo}>
            {'\n\n'}Contact Information:{'\n'}
            <Text
              style={styles.link}
              onPress={() => handleLinkPress('email', EMAILS.MAIN)}
            >
              • Email: {EMAILS.MAIN}
              {'\n'}
            </Text>
            <Text
              style={styles.link}
              onPress={() => handleLinkPress('phone', CONTACT.PHONE)}
            >
              • Phone: {CONTACT.PHONE}
              {'\n'}
            </Text>
            • Address: {CONTACT.ADDRESS}
          </Text>
        );
      case 22:
        return (
          <Text style={styles.contactInfo}>
            {'\n\n'}
            <Text
              style={styles.link}
              onPress={() => handleLinkPress('email', EMAILS.INFO)}
            >
              Email: {EMAILS.INFO}
            </Text>
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Terms and Conditions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionsContainer}>
          {ACCOUNT_JSON.TERMS_SECTIONS.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              renderContactInfo={renderContactInfo}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      padding: verticalScale(16),
      gap: verticalScale(16),
      paddingBottom: verticalScale(50),
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: verticalScale(16),
      marginTop: verticalScale(20),
    },
    sectionsContainer: { marginBottom: verticalScale(20) },
    sectionCard: {
      marginBottom: verticalScale(16),
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      color: theme.colors.primary,
      marginBottom: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
    sectionContent: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      lineHeight: moderateScale(20),
      fontFamily: 'Lato-Regular',
    },
    contactInfo: {
      fontSize: moderateScale(14),
      color: theme.colors.primary,
      lineHeight: moderateScale(22),
      fontFamily: 'Lato-Regular',
    },
  });

export default TermsAndConditions;
