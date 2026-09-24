import HealthService from '@api/services/HealthService';
import { useToast } from '@components/ui/Toast';
import { env } from '@config/index';
import { API_KEY } from '@constants/apiKey';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useLottieLoader } from '@provider/LottieLoaderProvider';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@store/authStore';
import { useHealthStore } from '@store/HEALTH/healthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Linking } from 'react-native';

export function useGetPersonalUsers() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async () => await HealthService.getPersonalUsers(),
    onSuccess: res => {
      const { success, message, data } = res?.data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCreateManualUser() {
  const { showToast } = useToast();
  const { updateSubStep, updateManualUser } = useHealthStore();

  return useMutation({
    mutationFn: async body => await HealthService.createManualUser(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      updateSubStep(3);
      updateManualUser(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCreateHealthInsurance() {
  const { showToast } = useToast();

  const navigation = useNavigation();
  const { updateInternalRef, updateHealthQuotesList, updateRegenerateData } =
    useHealthStore();
  const { mutate: filterHealthQuotes } = useFilterHealthQuotes();
  const { showLoader } = useLottieLoader();

  return useMutation({
    mutationFn: async body => await HealthService.createHealthInsurance(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      updateRegenerateData(data);
      showLoader('health');
      updateHealthQuotesList([]);
      updateInternalRef(data?.internalRef);
      setTimeout(() => {
        filterHealthQuotes({
          reqId: data?.internalRef,
          data: { coPays: '0' },
        });
      }, 2000);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useFilterHealthQuotes() {
  const { showToast } = useToast();
  const navigation = useNavigation();
  const { hideLoader } = useLottieLoader();

  return useMutation({
    mutationFn: async body => await HealthService.filterHealthQuotes(body),
    onSuccess: res => {
      const { message, data } = res?.data;
      hideLoader();
      console.log('data+++++++', data);
      navigation.navigate(SCREEN_NAMES.HEALTH_QUOTE_SCREEN, {
        data: data,
      });
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetFilterList(body) {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.FILTER_LIST],
    queryFn: async () => {
      try {
        const res = await HealthService.getFilterList(body);

        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },

    // mutationFn: async body => await HealthService.getFilterList(body),
    // onSuccess: res => {
    //   const { success, message, data } = res?.data;

    //   console.log('useGetFilterList', data);
    // },

    // onError: error => {
    //   showToast(error?.message, 'error');
    // },
    // meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCompareHealthQuotes() {
  const { showToast } = useToast();
  const { updateCompareHealthPolicy } = useHealthStore();
  const navigation = useNavigation();

  return useMutation({
    mutationFn: async body => await HealthService.compareHealthQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      updateCompareHealthPolicy(data);
      navigation.navigate(SCREEN_NAMES.HEALTH_INSURANCE_COMPARISON_SCREEN);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetHealthQuote(data) {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_QUOTES],
    queryFn: async () => {
      try {
        const res = await HealthService.getHealthQuote(data);

        console.log('res useGetHealthQuote', res);

        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetHealthInsuranceInfo(data) {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_INSURANCE_INFO],
    queryFn: async () => {
      try {
        const res = await HealthService.gethealthinsuranceinfo(data);

        console.log('res useGetHealthInsuranceInfo', res);

        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useUpdateHealthInsurance() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => await HealthService.updatehealthinsurance(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('useUpdateHealthInsurance', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useRegenerateQuotes(data) {
  const { showToast } = useToast();
  const { updateRegenerateData } = useHealthStore();

  return useMutation({
    mutationFn: async body => await HealthService.regenerateQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('useRegenerateQuotes', data);
      updateRegenerateData(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetProviderList() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => await HealthService.getProviderList(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('useGetProviderList', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useUploadDocument() {
  const { showToast } = useToast();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async body => {
      try {
        const response = await axios.post(
          `${env.API_URL}api/healthinfo/uploadDocuments`,
          body,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            timeout: 60000,
          },
        );

        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: res => {
      const { success, message, data } = res?.data;
      showToast('Document uploaded successfully', 'success');
      return data;
    },

    onError: error => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to upload document';
      showToast(errorMessage, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useContactAgentHealth() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => await HealthService.contactAgentHealth(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      showToast('Agent contacted successfully', 'success');
      return data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useDownloadQuote() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => await HealthService.downloadQuote(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('useDownloadQuote', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGenerateplancomparepdf() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => await HealthService.generateplancomparepdf(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('useGenerateplancomparepdf', data);

      Linking.openURL(env.API_BASE_URL + data?.link);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetHealthQuotes() {
  const { showToast } = useToast();
  const { updateInternalRef } = useHealthStore();

  return useMutation({
    mutationFn: async body => await HealthService.getHealthQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      updateInternalRef(data?.internalRef);
    },

    onError: error => {
      console.log('useGetHealthQuotes', error);
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
}
