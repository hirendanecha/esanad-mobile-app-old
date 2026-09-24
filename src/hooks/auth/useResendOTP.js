import AuthServices from '@api/services/authService';
import { useToast } from '@components/ui/Toast';
import { useMutation } from '@tanstack/react-query';

export const useResendOTP = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => AuthServices.resendOtp(body),
    onSuccess: res => {
      const { success, message } = res?.data;
      console.log('OTP resent successfully:', res?.data);
      showToast(message, 'success');
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};
