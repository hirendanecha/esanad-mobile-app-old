import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({
  title,
  textSecondarytyle = {},
  navigation,
  onBack,
  refresh = false,
  download = false,
  home = false,
  onDownload,
  onRefresh,
  onHome,
  icon = null,
  onIcon,
  transparent,
  noShadow,
}) => {
  const inset = useSafeAreaInsets();
  const { theme } = useThemeContext();
  const styles = style(theme, inset.top);

  const HeaderIcon = ({ children, onPress, extraStyle, testID }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.iconBtn, extraStyle]}
      accessibilityRole="button"
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.headerContainer,
        textSecondarytyle,
        transparent
          ? { backgroundColor: '#00000000' }
          : noShadow
          ? {}
          : {
              backgroundColor: theme.colors.backgroundColor,
              elevation: 5,
              shadowColor: theme.colors.text,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
      ]}
    >
      <HeaderIcon
        onPress={onBack ? onBack : navigation?.goBack}
        extraStyle={{ backgroundColor: theme.colors.bgSecondary }}
        testID="header-back-button"
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color={theme.colors.textTertiary}
        />
      </HeaderIcon>

      <Text style={styles.headerText} testID="header-title">{title}</Text>

      <View style={styles.rightIcons}>
        {refresh && (
          <FontAwesome
            name="refresh"
            size={18}
            color={theme.colors.textTertiary}
            onPress={onRefresh}
            testID="header-refresh-button"
          />
        )}
        {download && (
          <Feather
            name="download"
            size={18}
            color={theme.colors.textTertiary}
            style={styles.rightIconSpacing}
            onPress={onDownload}
            testID="header-download-button"
          />
        )}

        {home && (
          <HeaderIcon
            onPress={onHome}
            extraStyle={{ backgroundColor: theme.colors.bgSecondary }}
            testID="header-home-button"
          >
            <Feather
              name="home"
              size={18}
              color={theme.colors.textTertiary}
              onPress={onHome}
            />
          </HeaderIcon>
        )}

        {icon && (
          <TouchableOpacity onPress={onIcon}>
            <Image
              source={icon}
              resizeMode="cover"
              style={{
                width: verticalScale(28),
                height: verticalScale(28),
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        )}

        {!refresh && !download && !home && !icon && (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

export default Header;

const style = (theme, inset) =>
  StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      paddingTop: verticalScale(inset),
      flexDirection: 'row',
      paddingHorizontal: verticalScale(20),
      justifyContent: 'space-between',
      zIndex: 99,
    },
    iconBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      height: verticalScale(36),
      width: verticalScale(36),
      borderRadius: verticalScale(20),
    },
    headerText: {
      flex: 1,
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: verticalScale(20),
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightIconSpacing: {
      marginLeft: 10,
    },
    iconPlaceholder: {
      height: 28,
      width: 28,
    },
  });
