import { useMutation } from '@tanstack/react-query';

import { useNavigation } from '@react-navigation/native';
import AuthServices from '@api/services/authService';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useToast } from '@components/ui/Toast';
import { useUserStore } from '@store/userStore';
import { Alert } from 'react-native';
import { useAuthStore } from '@store/authStore';

export const useLogin = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => AuthServices.login(body),
    onSuccess: res => {
      const { success, message, data } = res?.data || {};
      navigation.navigate(SCREEN_NAMES.OTP_VERIFICATION_SCREEN, data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};

export const useFetchPolicies = () => {
  const navigation = useNavigation();
  const { updateOfflinePolicies } = useUserStore();

  return useMutation({
    mutationFn: body => AuthServices.fetchPolicies(body),
    onSuccess: res => {
      const { success, message, data } = res?.data || {};

      console.log('data useFetchPolicies', data);

      updateOfflinePolicies(data);
      navigation.reset({
        index: 1,
        routes: [
          { name: SCREEN_NAMES.BOTTOM_TABS },
          { name: SCREEN_NAMES.ACTIVE_POLICY },
        ],
      });
    },
    onError: error => {
      Alert.alert(
        'Policy Not Found',
        'Issue while fetching offline policies.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
        ],
      );
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};
