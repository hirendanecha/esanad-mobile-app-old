import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';

import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';

const License = () => {
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  return (
    <View
      style={{
        borderWidth: 1,
        alignSelf: 'center',
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundColor,
        marginTop: verticalScale(20),
        borderRadius: verticalScale(15),
      }}
    >
      <ImageBackground source={Images.license} style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: verticalScale(10),
          }}
        >
          <Image
            source={Images.eagle}
            resizeMode="contain"
            style={styles.logo}
          />

          <View style={styles.content}>
            <Text style={styles.label}>
              Licensed by the Central bank{'\n'}with License number: 287
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default License;

const useStyles = theme =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(10),
      paddingHorizontal: verticalScale(15),
      width: Dimensions.get('screen').width - 40,
      height: verticalScale(230),
      overflow: 'hidden',
      justifyContent: 'flex-end',
      borderRadius: verticalScale(15),
    },
    logo: {
      width: verticalScale(50),
      height: verticalScale(50),
    },
    label: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Black',
      color: theme.colors.textSecondary,
    },
  });
