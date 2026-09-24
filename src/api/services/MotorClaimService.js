import axiosInstance, { axiosInstanceForm } from '@api/axiosInstance';

const MotorClaimService = {
    getGarageList: async data =>
        await axiosInstance.post('api/claimpolicyrequest/get-garage-dropdown', data),

    finalClaimSubmit: async data =>
        await axiosInstanceForm.post('api/claimpolicyrequest/motor-claim-request', data),

    verifyCarRegistration: async data =>
        await axiosInstanceForm.post('api/user/verifycarregistrationcard', data),

    verifyDrivingLicense: async data =>
        await axiosInstanceForm.post('api/user/verifydrivinglicense', data),

    verifyEmiratesId: async data =>
        await axiosInstanceForm.post('api/user/verifyemiratesid', data),

    verifyPoliceReport: async data =>
        await axiosInstanceForm.post('api/user/verifypoliceReport', data),

    extractEmiratesId: async data =>
        await axiosInstanceForm.post('api/user/extractemiratesid', data),

    extractDrivingLicense: async data =>
        await axiosInstanceForm.post('api/user/extractdrivinglicence', data),

    extractPoliceReport: async data =>
        await axiosInstanceForm.post('api/user/extractpolicereport', data),
};

export default MotorClaimService;
