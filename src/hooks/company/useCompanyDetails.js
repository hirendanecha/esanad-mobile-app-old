import CompanyServices from '@api/services/CompanyService';
import { useToast } from '@components/ui/Toast';
import { API_KEY } from '@constants/apiKey';
import { useQuery } from '@tanstack/react-query';

export function useGetCompanyDetails(data) {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.COMPANY_DETAILS],
    queryFn: async () => {
      try {
        console.log('data', data);

        const res = await CompanyServices.companyProfile(data);
        console.log('res', res?.data?.data);

        return res.data?.data;
      } catch (error) {
        console.log('error', error);

        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

export function useGetAllCarInsuranceCompanies() {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.ALL_CAR_INSURANCE_COMPANIES],
    queryFn: async () => {
      try {
        const res = await CompanyServices.getAllCarInsuranceCompanies();
        return res.data?.data;
      } catch (error) {
        console.log('error', error);
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
}

