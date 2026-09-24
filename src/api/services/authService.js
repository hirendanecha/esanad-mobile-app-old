import axiosInstance from '@api/axiosInstance';

const AuthServices = {
  login: async body => {
    const res = await axiosInstance.post(`api/auth/sendotpuser`, body);
    return res;
  },

  verifyOtp: async body => {
    return axiosInstance.post('api/auth/verifyotpuser', body);
  },

  resendOtp: async body => {
    const res = await axiosInstance.post(`api/auth/sendotpuser`, body);
    return res;
  },

  fetchPolicies: async body => {
    const res = await axiosInstance.post(`api/user/findOfflinePolicyByEId`, body);
    return res;
  },
};

export default AuthServices;
