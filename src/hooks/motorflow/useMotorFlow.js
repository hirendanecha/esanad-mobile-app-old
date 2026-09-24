import MotorService from '@api/services/MotorService';
import { useToast } from '@components/ui/Toast';
import { API_KEY } from '@constants/apiKey';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useLottieLoader } from '@provider/LottieLoaderProvider';
import { useNavigation } from '@react-navigation/native';
import { useMotorDetalisStore, useMotorStore } from '@store/MOTOR/motorStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createId } from '@utils/randomIdCreate';

export function useYearList() {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.YEAR_LIST],
    queryFn: async () => {
      try {
        const res = await MotorService.getYearList();

        return res.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetBrandList(year) {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.getBrandList(body),
    onSuccess: res => {
      const { token, data, success, message } = res?.data;
      console.log('data', data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetModelList(data) {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.getModelList(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetTrimList(data) {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async body => MotorService.getTrimList(body),
    onSuccess: res => {
      const { data, success, message } = res?.data;
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetCarDetails(data) {
  const { showToast } = useToast();
  const { updateCarDeatils } = useMotorDetalisStore();

  return useMutation({
    mutationFn: async body => await MotorService.getCarDetail(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      updateCarDeatils(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCreateCarManually() {
  const { showToast } = useToast();
  const { updateCreateCarManual } = useMotorDetalisStore();

  return useMutation({
    mutationFn: async body => await MotorService.createCarManualy(body),
    onSuccess: res => {
      const { success, message } = res?.data;
      updateCreateCarManual(res?.data?.data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useSaveCarAndGetValuation() {
  const { showToast } = useToast();
  const { updateCalculateCarValue } = useMotorDetalisStore();

  return useMutation({
    mutationFn: async body => await MotorService.savecarandgetvaluation(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;

      updateCalculateCarValue(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useCalculateCarValue() {
  const { showToast } = useToast();
  const { updateCalculateCarValue } = useMotorDetalisStore();
  const { updateStep, updateSubStep } = useMotorStore();

  return useMutation({
    mutationFn: async body => await MotorService.calculateCarValue(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;

      updateCalculateCarValue(data);
      updateStep(2);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetMotorQuotes() {
  const { showToast } = useToast();
  const { updateQuotesList } = useMotorDetalisStore();
  const { navigate } = useNavigation();
  const { hideLoader } = useLottieLoader();

  return useMutation({
    mutationFn: async body => await MotorService.getMotorQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;

      console.log('data useGetMotorQuotes', data);
      updateQuotesList(data?.quotes);
      navigate(SCREEN_NAMES.INSURANCE_LIST_SCREEN, {
        data,
      });
      hideLoader();
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLottieLoader: false, showLoader: false, showError: false },
  });
}

export function useV1ListOfQuotes() {
  const { showToast } = useToast();
  const { createCarManual, manulUesrDetails, requestId } =
    useMotorDetalisStore();
  const { mutate: listOfQuotes } = useListOfQuotes();

  return useMutation({
    mutationFn: async body => await MotorService.v1ListOfQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;

      const payload = {
        carId: createCarManual?._id,
        motorInfoId: manulUesrDetails?.data?._id,
      };

      listOfQuotes({
        reqId: requestId,
        pId: manulUesrDetails?.proposalId,
        refId: data?.internalRef,
        qsId: data?.quotationNo,
        data: payload,
      });
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLottieLoader: false, showLoader: false, showError: false },
  });
}
export function useListOfQuotes() {
  const { showToast } = useToast();
  const { updateListQuotes } = useMotorDetalisStore();

  return useMutation({
    mutationFn: async body => await MotorService.listOfQuotes(body),
    onSuccess: res => {
      const { success, message, data } = res?.data;
      updateListQuotes(data);
    },

    onError: error => {
      showToast(error?.message, 'error');
    },
    meta: { showLottieLoader: false, showLoader: false, showError: false },
  });
}
