import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '@components/ui/Toast';
import { useMotorStore } from '@store/MOTOR/motorStore';

export const useReset = () => {
  const navigation = useNavigation();
  const { resetFlow } = useMotorStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      navigation.goBack();
    },
    onSuccess: () => {
      setTimeout(async () => {
        await resetFlow();
      }, 250);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};
