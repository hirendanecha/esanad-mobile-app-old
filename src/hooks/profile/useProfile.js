import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@components/ui/Toast';
import { useAuthStore } from '@store/authStore';
import ProfileServices from '@api/services/profileService';
import { API_KEY } from '@constants/apiKey';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useNavigation } from '@react-navigation/native';

export const useProfile = () => {
  const { showToast } = useToast();
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: () => ProfileServices.getMe(),
    onSuccess: res => {
      const { token, data, success } = res?.data;
      setUser(data);

      console.log('data', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useVerifyEmiratesId = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => ProfileServices.verifyemiratesid(body),
    onSuccess: res => {
      const { data, success } = res;
    },
    onError: error => {
      console.log('error', error);
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useVerifyDrivingLicense = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => ProfileServices.verifydrivinglicense(body),
    onSuccess: res => {
      const { data, success } = res?.data;
    },
    onError: error => {
      console.log('error', error);
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useUploadEmiratesId = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => ProfileServices.uploademiratesid(body),
    onSuccess: res => {
      const { data, success } = res?.data;

      console.log('data useUploadEmiratesId', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useRemoveEmiratesId = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => ProfileServices.removeemiratesid(body),
    onSuccess: res => {
      const { data, success } = res?.data || {};

      console.log('data useRemoveEmiratesId', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useUploadDrivingLicense = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => ProfileServices.uploaddrivinglicense(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      console.log('data useUploadDrivingLicense', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useRemoveDrivingLicense = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: body => ProfileServices.removedrivinglicense(body),
    onSuccess: res => {
      const { data, success } = res?.data || {};

      console.log('data useRemoveDrivingLicense', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useUpdateProfile = () => {
  const { showToast } = useToast();
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: data => ProfileServices.updateuserdetails(data),
    onSuccess: res => {
      const { data, success } = res?.data;
      setUser(data);

      console.log('Profile updated successfully', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useLoyaltyPoints = () => {
  const { showToast } = useToast();
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [API_KEY.LOYALTY_POINTS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.loyaltyPointsInfo({ id: user?._id });
        return res?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetUserVouchers = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.USER_VOUCHERS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getUserVoucher();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetAllVouchers = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.ALL_VOUCHERS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getAllVoucherCodes();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useVoucherPurchase = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: data => ProfileServices.purchaseVoucher(data),
    onSuccess: res => {
      const { message, success } = res?.data;

      console.log('useVoucherPurchase successfully', res?.data);
      showToast(message, 'success');
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useActiveQuotes = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.ACTIVE_QUOTES],
    queryFn: async () => {
      try {
        const res = await ProfileServices.activeQuotes();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useExpiredQuotes = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.EXPIRED_QUOTES],
    queryFn: async () => {
      try {
        const res = await ProfileServices.expiredQuotes();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useListoffercategories = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.LIST_OF_OFFER_CATEGORIES],
    queryFn: async () => {
      try {
        const res = await ProfileServices.listOfferCategories();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetPartnersByOffer = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: data => ProfileServices.getPartnersByOffers(data),
    onSuccess: res => {
      const { data, success } = res?.data;
      console.log('useGetPartnersByOffer successfully', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};

export const useListPartnersCategories = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.LIST_OF_PARTNERS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.listPartnerCategories();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetPartnersByCategory = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: data => ProfileServices.getPartnersByCategories(data),
    onSuccess: res => {
      const { data, success } = res?.data;
      console.log('useGetPartnersByCategory successfully', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: false, showError: false, showLottieLoader: false },
  });
};

export const useCreateCarByVinNo = () => {
  const { showToast } = useToast();
  const navigation = useNavigation();

  return useMutation({
    mutationFn: data => ProfileServices.createcarbyvinno(data),
    onSuccess: res => {
      const { data, success } = res?.data;
      console.log('useCreateCarByVinNo successfully', data);
      navigation.navigate(SCREEN_NAMES.CAR_DETAIL_VIEW, { data });
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetPartnerOffers = body => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.PARTNER_OFFERS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getPartnerOffers(body);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useAvailOffers = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: data => ProfileServices.availOffer(data),
    onSuccess: res => {
      const { token, data, success } = res?.data;

      console.log('data useAvailOffers', data);
    },
    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetFaq = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.FAQ],
    queryFn: async () => {
      try {
        const res = await ProfileServices.faqs();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useUploadProfilePic = () => {
  const { showToast } = useToast();
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: body => ProfileServices.uploadProfilePic(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
      if (success) {
        setUser(data);
        showToast(message || 'Profile picture updated successfully', 'success');
      }
    },
    onError: error => {
      showToast(error?.message || 'Failed to upload profile picture', 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};
