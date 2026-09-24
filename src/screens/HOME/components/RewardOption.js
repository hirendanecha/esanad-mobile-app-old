import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '@constants/screenNames';
import { Animations, Back, Images } from '@assets/index';
import LogoClub from '@assets/NEWICONS/LogoClub';
import { useAuthStore } from '@store/authStore';
import Crown from '@assets/NEWICONS/Crown';
import PolicyClaim from '@assets/NEWICONS/PolicyClaim';
import Voucher from '@assets/NEWICONS/Voucher';

const RewardOption = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const rewardOptions = [
    {
      id: 1,
      title: 'eSanad Privilege Club',
      name: user?.fullName,
      discription: 'Insure. Indulge. Save!\nclub.eSanad.com',
      navigation: SCREEN_NAMES.ESANASD_CLUB,
      icon: <Crown />,
      back: Back.Club,
    },
    {
      id: 2,
      title: 'My Policies & Claims',
      name: 'My Policies and\nClaims',
      discription: 'Insure. Indulge. Save!\nclub.eSanad.com',
      navigation: SCREEN_NAMES.PRODUCTS_SCREEN,
      icon: <PolicyClaim />,
      back: Back.Claim,
    },
    {
      id: 3,
      title: 'My eSanad Voucher',
      name: 'My eSanad Voucher',
      discription: 'Insure. Indulge. Save!\nclub.eSanad.com',
      navigation: SCREEN_NAMES.VOUCHER_SCREEN,
      icon: <Voucher />,
      back: Back.Loyalty,
    },
  ];

  return (
    <View
      style={{
        marginHorizontal: verticalScale(20),
        gap: verticalScale(20),
        marginTop: verticalScale(20),
      }}
    >
      <View style={{ gap: verticalScale(20) }}>
        {rewardOptions.map((option, index) => (
          <View style={{ gap: verticalScale(10) }}>
            <Text
              style={{
                fontSize: verticalScale(16),
                fontFamily: 'Lato-Bold',
                color: theme.colors.text,
              }}
            >
              {option.title}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(option.navigation)}
              style={{
                backgroundColor: theme.colors.card,
                width: Dimensions.get('screen').width - 40,
                alignItems: 'center',
                justifyContent: 'space-between',
                height: verticalScale(110),
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: verticalScale(15),
                overflow: 'hidden',
                flexDirection: 'row',
              }}
              activeOpacity={0.8}
              key={option.id}
            >
              <ImageBackground
                source={option.back}
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                }}
              />
              <View
                style={{
                  gap: verticalScale(5),
                  marginLeft: verticalScale(15),
                }}
              >
                {index == 0 && <LogoClub />}
                {index != 0 ? (
                  <MaskedView
                    maskElement={
                      <Text
                        style={{
                          fontSize: verticalScale(index == 0 ? 17 : 20),
                          fontFamily: 'Lato-Bold',
                          textTransform: index == 0 ? 'uppercase' : 'none',
                        }}
                      >
                        {option.name}
                      </Text>
                    }
                  >
                    <LinearGradient
                      colors={
                        index === 0
                          ? ['#FFFD33', '#D7D500']
                          : index === 1
                          ? [
                              theme.colors.description,
                              theme.colors.textTertiary,
                              theme.colors.description,
                              theme.colors.textTertiary,
                            ]
                          : [
                              theme.colors.description,
                              theme.colors.textTertiary,
                            ]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      locations={
                        index == 0 || index == 2
                          ? [0.5, 1]
                          : [0.15, 0.44, 0.65, 1]
                      }
                    >
                      <Text
                        style={{
                          fontSize: verticalScale(20),
                          fontFamily: 'Lato-Bold',
                          opacity: 0,
                        }}
                      >
                        {option.name}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                ) : (
                  <Text
                    style={{
                      fontSize: verticalScale(20),
                      fontFamily: 'Lato-Bold',
                      color: theme.colors.highlight,
                    }}
                  >
                    {option.name}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: verticalScale(10),
                    fontFamily: 'Lato-Regular',
                    color:
                      index == 0
                        ? theme.colors.textSecondary
                        : theme.colors.textTertiary,
                  }}
                >
                  {option.discription}
                </Text>
              </View>
              <View
                style={{
                  height: verticalScale(70),
                  width: verticalScale(70),
                  marginHorizontal: verticalScale(20),
                }}
              >
                {option.icon}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RewardOption;

const style = theme => StyleSheet.create({});
