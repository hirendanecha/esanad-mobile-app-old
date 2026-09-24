import axiosInstance from '@api/axiosInstance';

const HealthService = {
  getPersonalUsers: () => axiosInstance.get(`api/user/personalusers`),

  createManualUser: data =>
    axiosInstance.post(`api/healthinfo/manualuserdetails`, data),

  createHealthInsurance: data =>
    axiosInstance.post(`api/healthinfo/createhealthinsurance`, data),

  getHealthQuotes: ({ reqId = '', data = {} }) =>
    axiosInstance.post(
      `api/healthquotelist/gethealthquotes?reqId=${reqId}`,
      data,
    ),

  getFilterList: ({ reqId = '' }) =>
    axiosInstance.post(`api/healthquote/${reqId}/filterslist`, {}),

  filterHealthQuotes: ({ reqId = '', data = {} }) =>
    axiosInstance.post(`api/healthquote/${reqId}/filterhealthquotes`, data),

  compareHealthQuotes: ({ reqId = '', data = {} }) =>
    axiosInstance.post(`api/healthquote/${reqId}/comparehealthquotes`, data),

  getHealthQuote: ({ reqId = '' }) =>
    axiosInstance.get(`api/healthquote/${reqId}/gethealthquote`),

  gethealthinsuranceinfo: ({ reqId = '' }) =>
    axiosInstance.get(`api/healthinfo/${reqId}/gethealthinsuranceinfo`),

  updatehealthinsurance: ({ reqId = '', data = {} }) =>
    axiosInstance.put(`api/healthinfo/${reqId}/updatehealthinsurance`, data),

  regenerateQuotes: data =>
    axiosInstance.post(`api/healthinfo/regenerateQuotes`, data),

  getProviderList: ({ networkId = '' }) =>
    axiosInstance.get(`api/healthinfo/getProviderList?networkId=${networkId}`),

  contactAgentHealth: ({ reqId = '', data = {} }) =>
    axiosInstance.post(`api/healthquote/${reqId}/updatequote`, data),

  downloadQuote: ({ reqId = '' }) =>
    axiosInstance.get(`api/healthquote/${reqId}/downloadQuote`),

  generateplancomparepdf: ({ data = {} }) =>
    axiosInstance.post(`api/healthquote/generateplancomparepdf`, data),
};

export default HealthService;
