import { verticalScale } from '@constants/metrics';
import { Dimensions, StyleSheet } from 'react-native';

const ITEM_WIDTH = (Dimensions.get('screen').width - 70) / 4;

export const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flex: 1,
      paddingBottom: verticalScale(150),
    },
    sectionTitle: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Black',
      color: theme.colors.text,
      marginHorizontal: verticalScale(20),
      marginVertical: verticalScale(20),
    },
    tabsContainer: {
      paddingHorizontal: verticalScale(20),
      gap: verticalScale(10),
      alignItems: 'center',
      marginBottom: verticalScale(20),
    },
    tab: {
      height: verticalScale(40),
      width: verticalScale(150),
      borderRadius: verticalScale(20),
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
    },
    tabActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    tabText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.description,
    },
    tabTextActive: {
      color: theme.colors.textSecondary,
    },
    gridContainer: {
      gap: verticalScale(10),
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: verticalScale(20),
    },
    row: {
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    card: {
      width: ITEM_WIDTH,
      paddingVertical: verticalScale(10),
      borderRadius: verticalScale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    iconWrapper: {
      width: verticalScale(40),
      height: verticalScale(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardText: {
      fontSize: verticalScale(10),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
      paddingHorizontal: verticalScale(10),
    },
  });
