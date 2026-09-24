import React, { useState } from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { useThemeContext } from '@theme/ThemeProvider';

import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import Header from '@components/ui/Header';
import StepIndicator from '@components/ui/StepIndicator';

import QuotesScreen from '../PolicyDetails/QuotesScreen';
import FinalReviewScreen from '../FinalReview/FinalReviewScreen';
import LinearGradient from 'react-native-linear-gradient';
import style from './MotorFlowScreen.styles';
import CarDetails from '../CarDeatils/CarDetails';
import { SCREEN_NAMES } from '@constants/screenNames';

const stepScreens = {
  0: {
    1: <CarDetails />,
  },
  1: {
    1: <QuotesScreen />,
  },
  2: {
    1: <FinalReviewScreen />,
  },
};

const MotorFlowScreen = ({}) => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const styles = style(theme);

  const { step, subStep, updateStep } = useMotorStore();

  const renderStep = () => {
    if (stepScreens[step]) {
      return typeof stepScreens[step] === 'object'
        ? stepScreens[step][subStep]
        : stepScreens[step];
    }
    return null;
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else if (step > 0) {
      const prevStep = step - 1;
      updateStep(prevStep);
    }
    return true;
  };

  // Focus effect for backhandler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => handleBack();
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, subStep]),
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header
        title="Car Insurance"
        onBack={handleBack}
        home={step === 0 ? false : true}
        onHome={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: SCREEN_NAMES.BOTTOM_TABS }],
          })
        }
      />

      <View style={styles.stepIndicatorWrapper}>
        <StepIndicator
          steps={[
            { key: 'car', label: 'Car Details' },
            { key: 'details', label: 'Your Details' },
            { key: 'review', label: 'Review' },
          ]}
          currentStep={step}
          orientation="horizontal"
          labelPosition="below"
          showLabels
          spacing={0}
          allowFutureSelection={false}
          theme={{
            active: theme.colors.stepActive,
            completed: theme.colors.stepActive,
            inactive: theme.colors.stepBgColor,
            connector: theme.colors.border,
            label: theme.colors.textSecondary,
            labelText: theme.colors.text,
            subLabel: theme.colors.description,
          }}
        />
      </View>

      <WrapKeyboardAwareScrollView>
        <View style={styles.inner}>{renderStep()}</View>
      </WrapKeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default MotorFlowScreen;
