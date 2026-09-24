import axiosInstance, { axiosInstanceForm } from '@api/axiosInstance';
import MotorService from '../MotorService';

jest.mock('@api/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  axiosInstanceForm: {
    post: jest.fn(),
  },
}));

describe('MotorService', () => {
  it('fetches year list correctly', async () => {
    axiosInstance.get.mockResolvedValue({ data: [2024, 2023] });
    const res = await MotorService.getYearList();
    expect(axiosInstance.get).toHaveBeenCalledWith('api/cars/getyears');
    expect(res.data).toHaveLength(2);
  });

  it('verifies emirates id using multipart instance', async () => {
    const formData = { some: 'data' };
    axiosInstanceForm.post.mockResolvedValue({ data: { success: true } });
    await MotorService.verifyemiratesid(formData);
    expect(axiosInstanceForm.post).toHaveBeenCalledWith('api/user/verifyemiratesid', formData);
  });
});
