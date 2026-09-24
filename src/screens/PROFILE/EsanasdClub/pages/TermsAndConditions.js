import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import { ACCOUNT_JSON } from '@constants/Static/AccountJson';

const TermsAndConditionsClub = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          eSanad Club Loyalty Program Terms and Conditions
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.termItem}>
      <View style={styles.termHeader}>
        <Text style={styles.termNumber}>{item.id}.</Text>
        <Text style={styles.termTitle}>{item.title}</Text>
      </View>
      <Text style={styles.termContent}>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={ACCOUNT_JSON?.TERMS || []}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
    />
  );
};

export default TermsAndConditionsClub;

const getStyles = theme =>
  StyleSheet.create({
    listContentContainer: {
      paddingBottom: verticalScale(20),
      flexGrow: 1,
    },
    headerContainer: {
      alignItems: 'center',
      marginHorizontal: verticalScale(20),
      marginTop: verticalScale(15),
      marginBottom: verticalScale(20),
    },
    title: {
      fontSize: moderateScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      lineHeight: moderateScale(24),
      textAlign: 'center',
    },
    termItem: {
      marginHorizontal: verticalScale(20),
      marginBottom: verticalScale(20),
    },
    termHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(10),
    },
    termNumber: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      marginRight: verticalScale(6),
    },
    termTitle: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      flex: 1,
    },
    termContent: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      color: theme.colors.description,
    },
  });
