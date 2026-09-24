import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '@constants/screenNames';
import Emergency from '@assets/NEWICONS/LINKS/Emergency';
import Tools from '@assets/NEWICONS/LINKS/Tools';
import Award from '@assets/NEWICONS/LINKS/Award';
import Useful from '@assets/NEWICONS/LINKS/Useful';
import News from '@assets/NEWICONS/LINKS/News';
import Partner from '@assets/NEWICONS/LINKS/Partner';
import Cal from '@assets/NEWICONS/LINKS/Cal';

const QuickLinks = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const QUICK_LINKS = [
    {
      id: 1,
      name: 'Emergency',
      icon: <Emergency />,
      screen: () => navigation.navigate(SCREEN_NAMES.EMERGENCY_SCREEN),
    },
    {
      id: 2,
      name: 'Tools',
      icon: <Tools />,
      screen: () => navigation.navigate(SCREEN_NAMES.TOOLS_SCREEN),
    },
    {
      id: 3,
      name: 'Awards',
      icon: <Award />,
      screen: () => navigation.navigate(SCREEN_NAMES.AWARDS_LINK),
    },
    {
      id: 4,
      name: 'RTA Fines',
      icon: <Cal />,
      screen: () => navigation.navigate(SCREEN_NAMES.RTA_FINES),
    },

    {
      id: 5,
      name: 'Useful Links',
      icon: <Useful />,
      screen: () => navigation.navigate(SCREEN_NAMES.USEFUL_LINKS),
    },
    {
      id: 6,
      name: 'News/Media',
      icon: <News />,
      screen: () => navigation.navigate(SCREEN_NAMES.INSURANCE_BLOGS),
    },
    {
      id: 7,
      name: 'Insurance\nPartners',
      icon: <Partner />,
      screen: () => navigation.navigate(SCREEN_NAMES.INSURANCE_PARTNERS),
    },
  ];

  return (
    <View
      style={{
        marginTop: verticalScale(20),
        gap: verticalScale(10),
      }}
    >
      <Text
        style={{
          fontSize: verticalScale(16),
          fontFamily: 'Lato-Bold',
          color: theme.colors.text,
          marginHorizontal: verticalScale(20),
        }}
      >
        Quick Links
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          gap: verticalScale(15),
          flexDirection: 'row',
          paddingHorizontal: verticalScale(20),
          paddingBottom: verticalScale(10),
        }}
      >
        {QUICK_LINKS.map(option => (
          <View
            style={{
              gap: verticalScale(10),
              alignItems: 'center',
              width: verticalScale(80),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (option?.screen) {
                  option.screen();
                }
              }}
              style={{
                width: verticalScale(70),
                height: verticalScale(70),
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: verticalScale(90),
                overflow: 'hidden',
                flexDirection: 'row',
                backgroundColor: theme.colors.bgSecondary,
                padding: verticalScale(18),
              }}
              activeOpacity={0.8}
              key={option.id}
            >
              {option.icon}
            </TouchableOpacity>
            <Text
              style={{
                fontSize: verticalScale(12),
                fontFamily: 'Lato-Bold',
                textAlign: 'center',
                color: theme.colors.text,
              }}
            >
              {option.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuickLinks;
