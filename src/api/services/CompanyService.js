import axiosInstance from '@api/axiosInstance';

const CompanyServices = {
  companyProfile: async ({ id }) => {
    const res = await axiosInstance.get(`api/insurancecompany/web/${id}`);
    return res;
  },
  getAllCarInsuranceCompanies: async () => {
    const res = await axiosInstance.get(
      `api/insurancecompany/web/getallcarinsurancecompanies`,
    );
    return res;
  },
};

export default CompanyServices;
