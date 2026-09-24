import React from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { useThemeContext } from '@theme/ThemeProvider';
import { useAuthStore } from '@store/authStore';
import { ageCalculator } from '@utils/ageCalculator';
import { verticalScale } from '@constants/metrics';
import { useSocket } from '@provider/SocketProvider';
import { useCreateHealthInsurance } from '@hooks/HEALTH/healthFlow/useHealthFlow';
import style from './HealthFlowScreen.styles';
import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import CustomButton from '@components/ui/CustomButton';
import Header from '@components/ui/Header';
import StepIndicator from '@components/ui/StepIndicator';
import HealthQuotesScreen from './BasicDetails/HealthQuotesScreen';
import ExtraDetailScreen from './Extra Details/ExtraDetailScreen';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_NAMES } from '@constants/screenNames';
import Icon from 'react-native-vector-icons/Feather';

const HealthFlowScreen = ({ navigation, route }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const { user } = useAuthStore();
  const { socket, connected } = useSocket();
  const [step, setStep] = React.useState(0);
  const { mutate: createHealthInsurance } = useCreateHealthInsurance();

  const isSelf = route?.params?.type === 'Self';

  const [details, setDetails] = React.useState({
    kids: [],
    spouse: [],
  });

  const [error, setError] = React.useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: user?.fullName || '',
      mobileNumber: user?.mobileNumber || '',
      email: user?.email || '',
      nationality: user?.nationality || '',
      dateOfBirth: user?.dateOfBirth || '',
      age: ageCalculator(user?.dateOfBirth),
      country: user?.countryCode || '',
      city: user?.city || '',
      salary: 'Above 4000',
      gender: 'Male',
      maritalStatus: 'Single',
      visaStatus: 'New',
      visaType: null,
      currentInsurer: '',
      expiryDate: '',
      preExistingCondition: 'No',
      pregnantOrMaternity: 'No',
      hasKids: false,
      hasSpouse: false,
      kids: [],
      spouse: [],
    },
  });

  const currentMaritalStatus = watch('maritalStatus');

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else if (step === 1) {
      setStep(0);
      setError('');
    }
  };

  const onSubmitStep0 = data => {
    // navigation.navigate(SCREEN_NAMES.HEALTH_QUOTE_SCREEN, {
    //   data: {},
    // });
    if (!isSelf) {
      setStep(1);
    } else {
      handleSubmit(handleGetQuotes)();
    }
  };

  const handleDetailsChange = (type, list) => {
    setDetails(prev => ({ ...prev, [type]: list }));
  };

  const isValidDependent = dep => dep.fullName && dep.dateOfBirth && dep.gender;

  const validateAndProceed = () => {
    setError('');

    if (watch('maritalStatus') === 'Married') {
      if (details.spouse.length === 0) {
        setError('Please add spouse details');
        return;
      }
      if (!details.spouse.every(isValidDependent)) {
        setError('Please complete all spouse details');
        return;
      }
    }
    if (details.kids.length === 0) {
      setError('Please add at least one child');
      return;
    }
    if (!details.kids.every(isValidDependent)) {
      setError('Please complete all child details');
      return;
    }

    const kids = details.kids.length > 0;
    const spouse = details.spouse.length > 0;

    // Update form values
    setValue('hasKids', kids);
    setValue('hasSpouse', spouse);
    setValue('kids', details.kids);
    setValue('spouse', details.spouse);

    handleSubmit(handleGetQuotes)();
  };

  // const handleSocketEvents = referenceId => {
  //   console.log(
  //     '🚀 ~ file: HealthFlowScreen.js ~ line 140 ~ handleSocketEvents ~ referenceId',
  //     referenceId,
  //   );

  //   if (!socket || !connected) {
  //     console.log('❌ Socket not ready');
  //     return;
  //   }

  //   socket.emit('join', { room: referenceId });

  //   socket.off('health-quote-created');
  //   socket.on('health-quote-created', quote => {
  //     console.log('📊 Quote created: ', quote);
  //     // try {
  //     //   updateHealthQuotesList(quote);
  //     //   if (visible == false) {
  //     //     showLoader('health');
  //     //   }
  //     // } catch (err) {
  //     //   console.error('❌ Failed to update store', err);
  //     // }
  //   });

  //   // let hideLoaderTimeout;

  //   socket.off('quote-counter');
  //   socket.on('quote-counter', count => {
  //     console.log('📊 Quote counter:', count);

  //     // if (hideLoaderTimeout) {
  //     //   clearTimeout(hideLoaderTimeout);
  //     // }

  //     // if (count == -1) {
  //     //   hideLoaderTimeout = setTimeout(() => {
  //     //     // navigation.navigate(SCREEN_NAMES.HEALTH_QUOTE_SCREEN);
  //     //     hideLoader();
  //     //     hideLoaderTimeout = null;
  //     //   }, 500);
  //     // }
  //   });
  // };

  const handleGetQuotes = data => {
    const payload = {
      insurerType: route?.params?.type,
      nationality: user?.nationality,
      dateOfBirth: user?.dateOfBirth,
      mobileNumber: user?.mobileNumber,
      email: user?.email,
      fullName: user?.fullName,
      mobile: `${user?.countryCode}${user?.mobileNumber}`,
      countryCode: user?.countryCode,
      city: data?.city,
      job: '',
      salary: data?.salary,
      gender: user?.gender,
      maritalStatus: user?.maritalStatus,
      preferenceDetails: {
        dentalCoverage: false,
        opticalCoverage: false,
        preferredCoPay: ['0'],
        preferredHospital: [],
      },
      utmSource: '',
      utmCampaign: '',
      utmCampaignId: '',
      utmAdgroup: '',
      utmTerm: '',
      gcid: '',
      visaStatus:
        data?.visaStatus === 'Change status'
          ? data?.visaType
          : data?.visaStatus,
      regularMedication: data?.preExistingCondition === 'Yes',
      smoke: data?.preExistingCondition === 'Yes',
      hypertension: data?.preExistingCondition === 'Yes',
      diabetes: data?.preExistingCondition === 'Yes',
      currentInsurer: data?.currentInsurer,
      currentInsurerExpiryDate: data?.expiryDate,
      pregnantOrMaternity: data?.pregnantOrMaternity === 'Yes',
      isChangeStatus:
        data?.visaStatus === 'Change status' ? 'Change status' : '',
      ...(data.kids && data.kids.length > 0 && { kidsDetails: data.kids }),
      ...(data.spouse &&
        data.spouse.length > 0 && { spouseDetails: data.spouse }),
    };

    createHealthInsurance(payload);
    //   {
    //   onSuccess: res => {
    //     const { data } = res?.data;
    //     // handleSocketEvents(data?.internalRef);
    //     // handleSocketEvents(data?.proposal?.refId);
    //     handleSocketEvents(data?.reqId);
    //   },
    //   onError: error => {
    //     console.log('error', error);
    //   },
    // });
  };

  const renderSubmitButton = () => {
    if (step === 0) {
      return (
        <CustomButton
          title={isSelf ? 'Get Quotes' : 'Next'}
          onPress={handleSubmit(onSubmitStep0)}
          isShowIcon
          buttonStyle={styles.button}
        />
      );
    } else if (step === 1) {
      return (
        <CustomButton
          title="Get Quotes"
          disabled={false}
          onPress={validateAndProceed}
          isLoading={false}
          buttonStyle={styles.button}
          isShowIcon
        />
      );
    }
    return null;
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header
        title={'Health Insusdfsdfsdrance'}
        onBack={handleBack}
        home={true}
        onHome={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: SCREEN_NAMES.BOTTOM_TABS }],
          })
        }
      />

      <Text numberOfLines={1} style={styles.title}>
        {route.params?.type} Health Insurance
      </Text>

      {!isSelf && (
        <View
          style={[
            styles.stepIndicatorWrapper,
            {
              marginTop: !isSelf && verticalScale(20),
            },
          ]}
        >
          <StepIndicator
            steps={[
              { key: 'basic', label: 'Basic Details' },
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
      )}

      <WrapKeyboardAwareScrollView>
        <View
          style={[
            styles.inner,
            {
              marginTop: isSelf && verticalScale(20),
            },
          ]}
        >
          {step == 0 && (
            <HealthQuotesScreen
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              renderSubmitButton={renderSubmitButton}
            />
          )}
          {step == 1 && (
            <ExtraDetailScreen
              maritalStatus={currentMaritalStatus}
              details={details}
              error={error}
              onDetailsChange={handleDetailsChange}
              renderSubmitButton={renderSubmitButton}
            />
          )}
        </View>
      </WrapKeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default HealthFlowScreen;
