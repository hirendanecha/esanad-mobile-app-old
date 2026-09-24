import AuthServices from '@api/services/authService';
import { useToast } from '@components/ui/Toast';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useProfile } from '@hooks/profile/useProfile';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@store/authStore';
import { useMutation } from '@tanstack/react-query';

export const useOTPVerify = () => {
  const setAuth = useAuthStore(s => s.setAuth);
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { mutate: getProfile } = useProfile();
  const { setUserDetailsUpdate } = useAuthStore();

  return useMutation({
    mutationFn: body => AuthServices.verifyOtp(body),
    onSuccess: res => {
      const { token, data, success } = res?.data;
      setAuth({ token, user: data });

      getProfile();
      const newUser = res?.data?.isNew;

      if (newUser === true) {
        setUserDetailsUpdate(true);
        navigation.reset({
          index: 0,
          routes: [{ name: SCREEN_NAMES.NEW_USER_FORM }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: SCREEN_NAMES.BOTTOM_TABS }],
        });
      }
    },

    onError: error => {
      console.log('error', error);
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};
