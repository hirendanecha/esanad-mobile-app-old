import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import { Images } from '@assets/index';
import { SCREEN_NAMES } from '@constants/screenNames';

import Self from '@assets/images/Health/Self';
import SelfInvester from '@assets/images/Health/SelfInvester';
import SelfDependent from '@assets/images/Health/SelfDependent';
import SelfInvestorDependent from '@assets/images/Health/SelfInvestorDependent';
import DependentOnly from '@assets/images/Health/DependentOnly';
import { useHealthStore } from '@store/HEALTH/healthStore';

const CARD_WIDTH = Dimensions.get('screen').width - 40;

const InsuranceFor = () => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  const DATA = useMemo(
    () => [
      {
        icon: <Self />,
        name: 'Self',
        description: 'Ideal for individuals & working professionals',
      },
      {
        icon: <SelfInvester />,
        name: 'Self (Investor)',
        description: 'Best for investor visa or partner visa holders',
      },
      {
        icon: <SelfDependent />,
        name: 'Self & Dependent',
        description: 'Protect yourself along with spouse/children',
      },
      {
        icon: <DependentOnly />,
        name: 'Dependent Only',
        description: 'Covers children, parents or sponsored members',
      },
      {
        icon: <SelfInvestorDependent />,
        name: 'Self (Investor) &\nDependent',
        description: 'Complete care for investor & their dependents',
      },
      {
        icon: <DependentOnly />,
        name: 'Investor’s\nDependent Only',
        description: 'Only cover your investor family members',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );

  const IntroSection = ({ styles }) => (
    <View style={styles.introContainer}>
      <View>
        <Image
          source={Images.YellowHighlight}
          resizeMode="stretch"
          style={styles.highlightImage}
        />
        <Text style={styles.mainTitle}>Who's this insurance for?</Text>
      </View>

      <Text style={styles.subTitle}>
        Choose the easiest way to share them with us
      </Text>
    </View>
  );

  const handleInsuranceFor = val => {
    if (val) {
      navigation.navigate(SCREEN_NAMES.HEALTH_FLOW_SCREEN, { type: val });
    }
  };

  const InsuranceCard = ({ item, index, theme }) => {
    const isPrimary = index === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleInsuranceFor(item.name)}
        style={[
          styles.cardTouchable,
          isPrimary && { borderWidth: 0 },
          {
            borderColor: isPrimary ? theme.colors.primary : theme.colors.border,
          },
        ]}
      >
        <LinearGradient
          colors={
            isPrimary
              ? [theme.colors.linear2, theme.colors.linear1]
              : [theme.colors.bgLinear2, theme.colors.bgLinear2]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>{item.icon}</View>

            <Text
              style={[
                styles.cardTitle,
                {
                  color: isPrimary
                    ? theme.colors.textSecondary
                    : theme.colors.textTertiary,
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.cardDescription,
                isPrimary && {
                  color: theme.colors.textSecondary,
                  backgroundColor: theme.colors.modalOverlay,
                },
              ]}
            >
              Instant Quote
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      style={styles.container}
    >
      <Header title="Health Insurance" onBack={navigation.goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <IntroSection styles={styles} />

        <View style={styles.listContainer}>
          {DATA.map((item, index) => (
            <InsuranceCard
              item={item}
              index={index}
              styles={styles}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default InsuranceFor;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: verticalScale(20),
      gap: verticalScale(20),
    },
    introContainer: {
      alignItems: 'center',
      paddingHorizontal: verticalScale(20),
      gap: verticalScale(15),
    },
    highlightImage: {
      width: verticalScale(90),
      height: verticalScale(50),
      position: 'absolute',
      marginTop: -verticalScale(10),
      marginLeft: -verticalScale(20),
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: verticalScale(15),
    },
    cardTouchable: {
      width: CARD_WIDTH,
      height: verticalScale(95),
      borderRadius: verticalScale(15),
      borderWidth: 1,
    },
    cardGradient: {
      flex: 1,
      borderRadius: verticalScale(15),
    },
    cardContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: verticalScale(15),
      gap: verticalScale(10),
      flexDirection: 'row',
    },
    iconContainer: {
      height: verticalScale(40),
      width: verticalScale(40),
    },
    cardTitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',

      // textAlign: 'center',
    },
    cardDescription: {
      fontSize: verticalScale(10),
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
      color: theme.colors.text,
      backgroundColor: theme.colors.highlight,
      paddingHorizontal: verticalScale(5),
      paddingBottom: verticalScale(2),
      borderRadius: verticalScale(10),
      position: 'absolute',
      top: verticalScale(5),
      right: verticalScale(5),
    },
  });
