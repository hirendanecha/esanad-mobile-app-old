import MotorService from '@api/services/MotorService';
import { useToast } from '@components/ui/Toast';
import { API_KEY } from '@constants/apiKey';
import { useLottieLoader } from '@provider/LottieLoaderProvider';
import { useNavigation } from '@react-navigation/native';
import { useMotorDetalisStore, useMotorStore } from '@store/MOTOR/motorStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showToast } from '@utils/toastService';

export function useGetTopBrandList() {
  return useMutation({
    mutationFn: async body => MotorService.getTopBrandList(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetNationalList() {
  return useQuery({
    queryKey: ['topNationalList'],
    queryFn: async () => {
      try {
        const res = await MotorService.getNationality();
        return res.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export const useCreateUser = () => {
  const { updateManulUesrDetails } = useMotorDetalisStore();
  const { updateStep } = useMotorStore();

  return useMutation({
    mutationFn: async body => MotorService.createUser(body),
    onSuccess: res => {
      const { token, data, success, message } = res?.data;
      console.log('data', data);
      updateManulUesrDetails(res?.data?.data);
      updateStep(2);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export function useReviewMotor(data) {
  return useQuery({
    queryKey: [API_KEY.REVIEW_MOTOR],
    queryFn: async () => {
      try {
        const res = await MotorService.reviewmotor(data);
        return res.data?.data;
      } catch (error) {
        showToast(error?.response?.data?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetBenifitList(data) {
  return useQuery({
    queryKey: ['benifitList'],
    queryFn: async () => {
      try {
        const res = await MotorService.getBenefitList(data);
        return res.data?.data;
      } catch (error) {
        showToast(error?.response?.data?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetInsuranceList(data) {
  return useQuery({
    queryKey: ['insuranceList'],
    queryFn: async () => {
      try {
        const res = await MotorService.getInsuranceList(data);
        return res.data?.data;
      } catch (error) {
        showToast(error?.response?.data?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useFilterQuotes() {
  const { updateFilterData } = useMotorDetalisStore();
  const { hideLoader } = useLottieLoader();
  return useMutation({
    mutationFn: async body => MotorService.filterQuotes(body),
    onSuccess: res => {
      const { token, data, success, message } = res?.data;
      hideLoader();
      updateFilterData(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useSendEmailQuotes() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.emailQuote(body),
    onSuccess: res => {
      const { token, data, success, message } = res?.data;
      console.log('useSendEmailQuotes data', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useSendSMSQuotes() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.smsQuote(body),
    onSuccess: res => {
      const { token, data, success, message } = res?.data;
      console.log('useSendSMSQuotes data', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useSendToChatBot() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.sendToChatBot(body),
    onSuccess: res => {
      const { token, data, success, message } = res?.data;
      console.log('useSendToChatBot data', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}
