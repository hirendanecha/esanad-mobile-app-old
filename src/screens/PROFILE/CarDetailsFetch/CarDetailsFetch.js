import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import CustomButton from '@components/ui/CustomButton';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import { useCreateCarByVinNo } from '@hooks/profile/useProfile';

const CarDetailsFetch = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createCarByVinNo } = useCreateCarByVinNo();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      chassisNumber: '',
    },
    mode: 'onChange', // Validates on every change
  });

  const handleFormSubmit = async data => {
    console.log('Form data:', data);
    const payload = {
      vinNo: data?.chassisNumber,
    };
    createCarByVinNo(payload);
  };

  // Validation rules
  const chassisValidationRules = {
    required: 'Chassis number is required',
    minLength: {
      value: 17,
      message: 'Chassis number must be 17 characters',
    },
    maxLength: {
      value: 17,
      message: 'Chassis number must be 17 characters',
    },
    pattern: {
      value: /^[A-HJ-NPR-Z0-9]{17}$/,
      message: 'Invalid chassis number format',
    },
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={[styles.container]}
    >
      <Header
        title="Get Your Car Details"
        navigation={navigation}
        compare={true}
        onCompare={() =>
          console.log('Click here to start animation and remove aimation')
        }
      />
      <ScrollView
        contentContainerStyle={{
          padding: verticalScale(20),
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View
            style={{
              backgroundColor: theme.colors.backgroundColor,
              borderRadius: verticalScale(15),
              padding: verticalScale(15),
              borderWidth: 1,
              borderColor: errors.chassisNumber
                ? theme.colors.error
                : theme.colors.border,
              marginBottom: verticalScale(10),
            }}
          >
            <Controller
              control={control}
              rules={chassisValidationRules}
              render={({ field: { onChange, onBlur, value } }) => (
                <FloatingLabelInput
                  label="Enter car's Chassis Number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={17}
                  autoCapitalize="characters" // For VIN which is uppercase
                  error={errors?.chassisNumber?.message}
                  showErrorMessage={errors?.chassisNumber}
                />
              )}
              name="chassisNumber"
            />
          </View>

          {/* Optional: Show chassis number info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What is a Chassis Number?</Text>
            <Text style={styles.infoText}>
              • Also known as VIN (Vehicle Identification Number){'\n'}•
              17-character code found on your car's dashboard{'\n'}• Contains
              letters and numbers (excluding I, O, Q){'\n'}• Unique to your
              vehicle
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Find car details"
            onPress={handleSubmit(handleFormSubmit)}
            isShowIcon
            loading={isLoading}
            disabled={isLoading || Object.keys(errors).length > 0}
            textStyle={{
              fontFamily: 'Lato-Bold',
              fontSize: verticalScale(16),
            }}
            buttonStyle={{
              height: verticalScale(50),
              opacity: isLoading || Object.keys(errors).length > 0 ? 0.7 : 1,
            }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    errorText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.error,
      marginTop: verticalScale(8),
      marginLeft: verticalScale(5),
    },
    hintText: {
      fontSize: verticalScale(11),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      marginTop: verticalScale(8),
      marginLeft: verticalScale(5),
      fontStyle: 'italic',
    },
    infoContainer: {
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: verticalScale(10),
      padding: verticalScale(15),
      marginTop: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    infoTitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      marginBottom: verticalScale(8),
    },
    infoText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      lineHeight: verticalScale(18),
    },
    buttonContainer: {
      marginTop: verticalScale(20),
      marginBottom: verticalScale(10),
    },
    headerText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
  });

export default CarDetailsFetch;
