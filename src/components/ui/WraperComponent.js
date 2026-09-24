import React from 'react';
import { StyleSheet, View } from 'react-native';
import { verticalScale } from '@constants/metrics';

const WraperComponent = ({ children, customStyle }) => {
  const styles = style();
  return <View style={[styles.mainContainer, customStyle]}>{children}</View>;
};

export default WraperComponent;

const style = () =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      width: '90%',
      marginBottom: verticalScale(10),
      paddingTop: verticalScale(10),
      alignSelf: 'center',
    },
  });
