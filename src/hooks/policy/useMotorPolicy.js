import MotorService from '@api/services/MotorService';
import PolicyServices from '@api/services/PolicyService';
import { useToast } from '@components/ui/Toast';
import { env } from '@config/index';
import { API_KEY } from '@constants/apiKey';
import { SCREEN_NAMES } from '@constants/screenNames';
import { Link, useNavigation } from '@react-navigation/native';
import { usePolicyStore } from '@store/MOTOR/policyStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Linking } from 'react-native';

export function useGetPolicyDetails(data) {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.POLICY_DETAILS],
    queryFn: async () => {
      try {
        const res = await PolicyServices.policyDetails(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetProduct() {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.PRODUCT],
    queryFn: async () => {
      try {
        const res = await PolicyServices.policyProducts();

        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetExtraFeatures() {
  const { showToast } = useToast();
  const { updateExtraFeature } = usePolicyStore();

  return useMutation({
    mutationFn: async body => PolicyServices.extraFeatures(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('useGetExtraFeatures data', data);
      updateExtraFeature(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetPolicySummary(data) {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.POLICY_SUMMARY],
    queryFn: async () => {
      try {
        const res = await PolicyServices.quoteSummary(data);

        return res?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCompareQuotes() {
  const { showToast } = useToast();
  const { navigate } = useNavigation();
  const { updateComparePolicy } = usePolicyStore();

  return useMutation({
    mutationFn: async body => await MotorService.compareQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('data', data);
      updateComparePolicy(data);
      navigate(SCREEN_NAMES.INSURANCE_COMPARISON_SCREEN);
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
    mutationFn: async body => MotorService.cardownloadQuote(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('data', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCompareQuotesDownload() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.comparequotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;

      Linking.openURL(env.API_BASE_URL + data?.link);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifyemiratesid() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.verifyemiratesid(body),
    onSuccess: res => {
      const { data, success } = res;
    },
    onError: error => {
      console.log('error', error);
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifydrivinglicense() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.verifydrivinglicense(body),
    onSuccess: res => {
      const { data, success } = res?.data;
    },
    onError: error => {
      console.log('error', error);
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifycarregistrationcard() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.verifycarregistrationcard(body),
    onSuccess: res => {
      const { data, success } = res?.data;
    },
    onError: error => {
      console.log('error', error);
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifycarinsurance() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.verifycarinsurance(body),
    onSuccess: res => {
      const { data, success } = res?.data;
    },
    onError: error => {
      console.log('error', error);
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useUploademiratesid() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.uploademiratesid(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useUploademiratesid', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useUploaddrivinglicense() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.uploaddrivinglicense(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useUploadvehicledocuments() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.uploadvehicledocuments(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useContactAgent() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => PolicyServices.contactAgent(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;

      return data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useKycInformation() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => PolicyServices.kycInformation(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data', res);

      return data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

// Motor Cancellation Hooks
export function useVerifyIban() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.verifyiban(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useVerifyIban', data);
      return data;
    },
    onError: error => showToast(error?.message || 'IBAN verification failed', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useExtractIban() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.extractiban(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useExtractIban', data);
      return data;
    },
    onError: error => showToast(error?.message || 'IBAN extraction failed', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifyInsuranceCertificate() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.verifyinsurancecertificate(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useVerifyInsuranceCertificate', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Insurance certificate verification failed', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifyReversalInsurance() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.verifyreversalinsurance(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useVerifyReversalInsurance', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Reversal insurance verification failed', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useVerifyOwnershipDocument() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.verifyownershipdocument(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useVerifyOwnershipDocument', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Ownership document verification failed', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCancelPolicyRequest() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.cancelPolicyRequest(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useCancelPolicyRequest', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Failed to submit cancellation request', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useUploadItVehicleDocuments() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.uploaditvehicledocuments(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useUploadItVehicleDocuments', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Failed to upload IT vehicle documents', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useScanInsuranceCertificate() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.scaninsurancecertificate(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useScanInsuranceCertificate', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Failed to scan insurance certificate', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useScanReversalInsurance() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: async body => MotorService.scanReversalInsurance(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useScanReversalInsurance', data);
      return data;
    },
    onError: error => showToast(error?.message || 'Failed to scan reversal insurance', 'error'),
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}


export const useGetPolicyBySearch = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async policyNumber => await PolicyServices.getPolicyBySearch(policyNumber),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useGetPolicyBySearch', data);
      return data;
    },
    onError: error => {
      showToast(error?.response?.data?.message || error?.message || 'Policy not found', 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};