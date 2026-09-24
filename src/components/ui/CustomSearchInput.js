import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import { useThemeContext } from '@theme/ThemeProvider';
import Search from '@assets/icons/Search';
import { verticalScale } from '@constants/metrics';

const CustomSearchInput = ({ value, onChange, title, container }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <View style={[styles.searchContainer, container]}>
      <Search />
      <TextInput
        style={styles.searchInput}
        placeholder={title}
        placeholderTextColor={theme.colors.description}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

export default CustomSearchInput;

const style = theme =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      paddingHorizontal: verticalScale(15),
      height: verticalScale(50),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: verticalScale(15),
    },
    searchInput: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      height: '100%',
    },
  });
