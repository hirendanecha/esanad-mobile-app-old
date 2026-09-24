import axiosInstance, { axiosInstanceForm } from '@api/axiosInstance';

const ProfileServices = {
  getMe: async () => await axiosInstance.get(`api/user/me`),

  verifyemiratesid: data =>
    axiosInstanceForm.post(`api/user/verifyemiratesid`, data),

  verifydrivinglicense: data =>
    axiosInstanceForm.post(`api/user/verifydrivinglicense`, data),

  uploademiratesid: async ({ id, data }) =>
    await axiosInstanceForm.post(`api/user/uploademiratesid/${id}`, data),

  removeemiratesid: async ({ id }) =>
    await axiosInstance.post(`api/user/${id}/removeemiratesid`),

  uploaddrivinglicense: async ({ id, data }) =>
    await axiosInstanceForm.post(`api/user/uploaddrivinglicense/${id}`, data),

  removedrivinglicense: async ({ id }) =>
    await axiosInstance.post(`api/user/${id}/removedrivinglicense`),

  updateuserdetails: async data =>
    await axiosInstance.post(`api/user/updateuserdetails`, data),

  loyaltyPointsInfo: async ({ id }) =>
    await axiosInstance.get(`api/user/${id}/getRedeemPoints`),

  getUserVoucher: async () =>
    await axiosInstance.get(`api/evoucher/getUserVoucherCodes`),

  getAllVoucherCodes: async () =>
    await axiosInstance.get(`api/evoucher/getAllVoucherCodes`),

  purchaseVoucher: async data =>
    await axiosInstance.post(`api/evoucher/createVoucherRequest`, data),

  activeQuotes: async () =>
    await axiosInstance.get(`api/quotes/getactivequote`),

  expiredQuotes: async () =>
    await axiosInstance.get(`api/quotes/getexpiredquote`),

  listOfferCategories: async () =>
    await axiosInstance.get(`api/club/listoffercategories`),

  getPartnersByOffers: async ({ search, data }) =>
    await axiosInstance.post(
      `api/club/getpartnersbyoffers?search=${search}`,
      data,
    ),

  listPartnerCategories: async () =>
    await axiosInstance.get(`api/club/listpartnercategories`),

  getPartnersByCategories: async ({ search, data }) =>
    await axiosInstance.post(`api/club/getpartners?search=${search}`, data),

  getPartnerOffers: async ({ id }) =>
    await axiosInstance.get(`api/club/${id}/getpartneroffers`),

  availOffer: async ({ id, data }) =>
    await axiosInstance.post(`api/club/${id}/availpartneroffer`, data),

  faqs: async () => await axiosInstance.get(`api/blog/faqs`),

  createcarbyvinno: async data =>
    await axiosInstance.post(`api/cars/createcarbyvinno`, data),

  //======================================================================= Policies Services Expired =======================================================================
  getMotorExpiredPolicy: async () =>
    await axiosInstance.get(`api/policies/getexpiredpolicy`),

  getHealthExpiredPolicy: async () =>
    await axiosInstance.get(`api/healthquote/getexpiredpolicy`),

  getTravelExpiredPolicy: async () =>
    await axiosInstance.get(`api/travelpolicy/getexpiredpolicy`),

  getLandExpiredPolicy: async () =>
    await axiosInstance.get(`api/landquote/showexpiredpolicies`),

  //======================================================================= Policies Services Cancelled =======================================================================
  getMotorCancelledPolicy: async () =>
    await axiosInstance.get(`api/policies/getcancelledpolicy`),

  getHealthCancelledPolicy: async () =>
    await axiosInstance.get(`api/healthquote/getcancelledpolicy`),

  getTravelCancelledPolicy: async () =>
    await axiosInstance.get(`api/travelpolicy/getcancelledpolicy`),

  //======================================================================= Policies Services Expiring =======================================================================
  getMotorExpiringPolicy: async () =>
    await axiosInstance.get(`api/policies/getexpiringpolicy`),

  getHealthExpiringPolicy: async () =>
    await axiosInstance.get(`api/healthquote/getexpiringpolicy`),

  getTravelExpiringPolicy: async () =>
    await axiosInstance.get(`api/travelpolicy/getexpiringpolicy`),

  //======================================================================= Policies Services Active =======================================================================
  getMotorActivePolicy: async () =>
    await axiosInstance.get(`api/policies/getactivepolicy`),

  getHealthActivePolicy: async () =>
    await axiosInstance.get(`api/healthquote/getactivepolicy`),

  getTravelActivePolicy: async () =>
    await axiosInstance.get(`api/travelpolicy/getactivepolicy`),

  getLandActivePolicy: async () =>
    await axiosInstance.post(`api/landquote/showactivepolicies`),

  //======================================================================= Policies Services Details =======================================================================
  getMotorPolicyDetails: async ({ id }) =>
    await axiosInstance.get(`api/policies/policydetail/${id}`),

  getHealthPolicyDetails: async ({ id }) =>
    await axiosInstance.get(`api/healthquote/policydetail/${id}`),

  getTravelPolicyDetails: async ({ id }) =>
    await axiosInstance.get(`api/travelpolicy/policydetail/${id}`),

  uploadProfilePic: async data =>
    await axiosInstanceForm.post(`api/user/upload-profile-pic`, data),
};

export default ProfileServices;
