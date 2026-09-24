import { StyleSheet } from 'react-native';

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
  });

export default style;
