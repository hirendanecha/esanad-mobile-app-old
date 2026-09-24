import axiosInstance from '@api/axiosInstance';

const PolicyServices = {
  policyDetails: async ({ id }) =>
    await axiosInstance.get(`api/quotes/quotedetail/${id}`),

  policyProducts: async () => {
    const res = await axiosInstance.get(`api/quotes/getproducts`);
    return res;
  },

  extraFeatures: async ({ summaryId, data }) => {
    const res = await axiosInstance.post(
      `api/quotes/${summaryId}/updateaddons`,
      data,
    );
    return res;
  },

  quoteSummary: async ({ id }) =>
    await axiosInstance.get(`api/quotes/quotesummary/${id}`),

  contactAgent: async ({ id, data }) =>
    await axiosInstance.post(`api/quotes/${id}/updateautoquote`, data),

  kycInformation: async ({ id, data }) =>
    await axiosInstance.post(`api/user/${id}/updateuser`, data),

  getPolicyBySearch: async policyNumber =>
    await axiosInstance.get(`api/endorsement/getPolicy?search=${policyNumber}`),
};

export default PolicyServices;
