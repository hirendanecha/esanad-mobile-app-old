import axiosInstance, { axiosInstanceForm } from '@api/axiosInstance';

const MotorService = {
  // Top Cars
  getTopBrandList: ({ year }) =>
    axiosInstance.get(`api/cars/gettopcars?year=${year}`),

  // Cars
  getYearList: () => axiosInstance.get('api/cars/getyears'),

  getBrandList: ({ year }) =>
    axiosInstance.get(`api/cars/getnewcars?year=${year}`),

  getModelList: data => axiosInstance.post(`api/cars/getnewmodels`, data),

  getTrimList: data => axiosInstance.post(`api/cars/gettrim`, data),

  getCarDetail: data => axiosInstance.post(`api/cars/getcardetails`, data),

  createCarManualy: data =>
    axiosInstance.post(`api/cars/createcarmanually`, data),

  savecarandgetvaluation: data =>
    axiosInstance.post(`api/cars/savecarandgetvaluation`, data),

  getNationality: () => axiosInstance.get(`api/cars/getnationalities`),

  createUser: ({ id, data }) =>
    axiosInstance.post(`api/cars/createuser/${id}`, data),

  reviewmotor: data => axiosInstance.post(`api/cars/reviewmotor`, data),

  calculateCarValue: data =>
    axiosInstance.post(`api/cars/calculatecarvalue`, data),

  getMotorQuotes: ({ data }) =>
    axiosInstance.post(`api/cars/getmotorquotes`, data),

  getBenefitList: ({ referenceId = '' }) =>
    axiosInstance.get(`api/quotes/getbenefits/${referenceId}`),

  getInsuranceList: ({ referenceId = '' }) =>
    axiosInstance.get(`api/quotes/getinsurerlist/${referenceId}`),

  filterQuotes: ({ referenceId = '', data = {} }) =>
    axiosInstance.post(`api/quotes/filterquotes/${referenceId}`, data),

  compareQuotes: ({ referenceId = '', data = {} }) =>
    axiosInstance.post(`api/quotes/comparemultiplequotes/${referenceId}`, data),

  cardownloadQuote: ({ refId = '' }) =>
    axiosInstance.get(`api/cars/${refId}/cardownloadQuote`),

  comparequotes: ({ refId = '', data = {} }) =>
    axiosInstance.post(`api/pdf/${refId}/comparequotes`, data),

  verifyemiratesid: data =>
    axiosInstanceForm.post(`api/user/verifyemiratesid`, data),

  verifydrivinglicense: data =>
    axiosInstanceForm.post(`api/user/verifydrivinglicense`, data),

  verifycarregistrationcard: data =>
    axiosInstanceForm.post(`api/user/verifycarregistrationcard`, data),

  uploademiratesid: ({ carId = '', data }) =>
    axiosInstanceForm.post(`api/user/uploademiratesid/${carId}`, data),

  uploaddrivinglicense: ({ carId = '', data }) =>
    axiosInstanceForm.post(`api/user/uploaddrivinglicense/${carId}`, data),

  uploadvehicledocuments: ({ carId = '', data }) =>
    axiosInstanceForm.post(`api/cars/uploaditvehicledocuments`, data),

  // Quotes
  v1ListOfQuotes: ({ reqId = '', pId = '', data = {} }) =>
    axiosInstance.post(`api/v1/listofquotes?reqId=${reqId}&pId=${pId}`, data),

  listOfQuotes: ({ reqId = '', pId = '', refId = '', qsId = '', data = {} }) =>
    axiosInstance.post(
      `api/listofquotes?reqId=${reqId}&pId=${pId}&refId=${refId}&qsId=${qsId}`,
      data,
    ),

  emailQuote: ({ refId = '', pId = '', data = {} }) =>
    axiosInstance.post(`api/quotes/${refId}/${pId}/emailquotes`, data),

  smsQuote: ({ refId = '', pId = '', data = {} }) =>
    axiosInstance.post(`api/quotes/${refId}/${pId}/smsquotes`, data),

  sendToChatBot: data =>
    // console.log('---', data),
    axiosInstance.post(
      `https://api.aibot.esanad.com/api/public/chat/add-customer-to-chatbot`,
      data,
      {
        headers: {
          'x-stack-token':
            'IGAA6YRYASZAeBBZAE9zRUp1YWFmNEdZAN2ctMlhoU1BCWG1fWH',
        },
      },
    ),
  // Motor Cancellation
  verifyiban: data => axiosInstanceForm.post(`api/user/verifyiban`, data),
  extractiban: data => axiosInstanceForm.post(`api/user/extractiban`, data),
  verifyinsurancecertificate: data =>
    axiosInstanceForm.post(`api/user/verifyinsurancecertificate`, data),
  scaninsurancecertificate: data =>
    axiosInstanceForm.post(`api/user/scaninsurancecertificate`, data),
  verifyreversalinsurance: data =>
    axiosInstanceForm.post(`api/user/verifyreversalinsurance`, data),
  scanReversalInsurance: data =>
    axiosInstanceForm.post(`api/user/scanReversalInsurance`, data),
  verifyownershipdocument: data =>
    axiosInstanceForm.post(`api/user/verifyownershipdocument`, data),
  cancelPolicyRequest: data =>
    axiosInstanceForm.post(`api/endorsement/cancel-policy-request`, data),
  uploaditvehicledocuments: data =>
    axiosInstanceForm.post(`api/cars/uploaditvehicledocuments`, data),
};

export default MotorService;
