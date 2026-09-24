import HomeServices from '@api/services/HomeService';
import { useToast } from '@components/ui/Toast';
import { API_KEY } from '@constants/apiKey';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetBlog() {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.BLOG],
    queryFn: async () => {
      try {
        const res = await HomeServices.blog();
        return res?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetRating() {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.RATING],
    queryFn: async () => {
      try {
        const res = await HomeServices.rating();
        return res?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetFinecalculationtool() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => await HomeServices.finecalculationtool(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      console.log('useGetFinecalculationtool', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetactivepolicy() {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.ACTIVE_POLICY],
    queryFn: async () => {
      try {
        const res = await HomeServices.getactivepolicy();
        return res?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}
