import axiosInstance from '@api/axiosInstance';
import AuthServices from '../authService';

jest.mock('@api/axiosInstance', () => ({
  post: jest.fn(),
}));

describe('AuthServices', () => {
  it('calls login endpoint with correct body', async () => {
    const body = { username: 'test' };
    axiosInstance.post.mockResolvedValue({ data: { success: true } });
    
    const res = await AuthServices.login(body);
    
    expect(axiosInstance.post).toHaveBeenCalledWith('api/auth/sendotpuser', body);
    expect(res.data.success).toBe(true);
  });

  it('calls verifyOtp endpoint with correct body', async () => {
    const body = { otp: '1234' };
    axiosInstance.post.mockResolvedValue({ data: { success: true } });
    
    await AuthServices.verifyOtp(body);
    
    expect(axiosInstance.post).toHaveBeenCalledWith('api/auth/verifyotpuser', body);
  });
});
