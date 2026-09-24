import axiosInstance from '@api/axiosInstance';

const HomeServices = {
  blog: () => axiosInstance.get('api/blog/read'),
  rating: () => axiosInstance.get('api/rating/getesanadrating'),
  finecalculationtool: data =>
    axiosInstance.post('api/healthquote/finecalculationtool', data),
  getactivepolicy: () => axiosInstance.get('api/policies/getactivepolicy'),
};

export default HomeServices;
