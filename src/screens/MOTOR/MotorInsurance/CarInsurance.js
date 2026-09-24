import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import { Images } from '@assets/index';
import { SCREEN_NAMES } from '@constants/screenNames';
import ComingSoon from '@components/ui/ComingSoon';

const CarInsurance = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const DATA = [
    // {
    //   icon: Images.chassis,
    //   name: 'Car Chassis Number',
    //   description: 'Get the most quotes and best options with this method.',
    //   onClick: () => {},
    //   soon: true,
    // },
    {
      icon: Images.manual,
      name: 'Add Car Manually',
      description:
        'Enter basic car info you already know — like brand, model, GCC spec, and more',
      onClick: () => navigation.navigate(SCREEN_NAMES.MOTOR_FLOW_SCREEN),
    },
    {
      icon: Images.pass,
      name: 'UAE PASS',
      description: 'Renew your car insurance or get a new one using UAE PASS',
      onClick: () => {},
      soon: true,
    },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      style={styles.container}
    >
      <Header title="Car Insurance" onBack={navigation.goBack} />

      <View style={styles.content}>
        <View style={styles.introContainer}>
          <View>
            <Image
              source={Images.YellowHighlight}
              resizeMode="stretch"
              style={styles.highlightImage}
            />
            <Text style={styles.mainTitle}>
              Up to 30% Off We need some details about your car!
            </Text>
          </View>

          <Text style={styles.subTitle}>
            Choose the easiest way to share them with us
          </Text>
        </View>

        <View style={styles.listContainer}>
          {DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={item.onClick}
              style={styles.card}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: verticalScale(10),
                  padding: verticalScale(15),
                }}
              >
                {item.soon && <ComingSoon />}
                <Image
                  source={item.icon}
                  resizeMode="contain"
                  style={styles.cardIcon}
                />

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

export default CarInsurance;

/* -------------------- STYLES -------------------- */

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: verticalScale(20),
      gap: verticalScale(20),
    },
    introContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: verticalScale(20),
      gap: verticalScale(15),
    },
    highlightImage: {
      width: verticalScale(90),
      height: verticalScale(50),
      position: 'absolute',
      marginTop: -verticalScale(10),
      marginLeft: verticalScale(25),
      transform: [{ rotate: '-10deg' }],
    },
    mainTitle: {
      color: theme.colors.textTertiary,
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      textAlign: 'center',
    },
    subTitle: {
      color: theme.colors.textTertiary,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
    },
    listContainer: {
      gap: verticalScale(20),
    },
    card: {
      borderRadius: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    cardIcon: {
      width: verticalScale(65),
      height: verticalScale(65),
    },
    cardContent: {
      flex: 1,
      justifyContent: 'center',
      gap: verticalScale(5),
    },
    cardTitle: {
      color: theme.colors.textTertiary,
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Bold',
    },
    cardDescription: {
      color: theme.colors.description,
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
    },
  });
