import { env } from '@config/index';
import { LogoutReset } from '@provider/RootNavigation';
import { authStore } from '@store/authStore';
import axios from 'axios';
import { showToast } from '@utils/toastService';

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
});

// Attach token
axiosInstance.interceptors.request.use(config => {
  const token = authStore.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Handle 401s (simple strategy: logout)
axiosInstance.interceptors.response.use(
  res => res,
  error => {
    if (error?.response?.status === 401) {
      authStore.logout();
      LogoutReset();
    }
    const message =
      error?.response?.data?.actualMessage ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';
    showToast({ message, type: 'error' });
    console.log('========>', error?.response);

    return Promise.reject(error?.response?.data || error);
  },
);

export default axiosInstance;

const axiosInstanceForm = axios.create({
  baseURL: env.API_URL,
});

axiosInstanceForm.interceptors.request.use(config => {
  const token = authStore.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

axiosInstanceForm.interceptors.response.use(
  res => res,
  error => {
    if (error?.response?.status === 401) {
      authStore.logout();
      LogoutReset();
    }
    const message =
      error?.response?.data?.actualMessage ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';
    showToast({ message, type: 'error' });
    console.log('=====Form===>', error?.response);

    return Promise.reject(error?.response?.data || error);
  },
);

export { axiosInstanceForm };
