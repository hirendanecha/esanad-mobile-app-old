import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import { moderateScale, verticalScale } from '@constants/metrics';

const { width } = Dimensions.get('window');

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('InsuranceList');
    }, 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        gap: verticalScale(20),
      }}
    >
      <FastImage
        source={require('../../assets/images/common/motor-loading.gif')}
        style={{
          width: width * 0.8,
          height: width * 0.45,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={{ gap: verticalScale(10), alignItems: 'center' }}>
        <Text
          style={{
            fontSize: moderateScale(18),
            fontFamily: 'Inter',
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          Sit back and relax.
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: moderateScale(18),
            fontFamily: 'Inter',
            fontWeight: 'bold',
          }}
        >
          We're finding your data...
        </Text>
      </View>
      <Text
        style={{
          fontWeight: '400',
          fontSize: moderateScale(16),
          fontFamily: 'Inter',
          color: 'black',
        }}
      >
        It might take a minute.
      </Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
