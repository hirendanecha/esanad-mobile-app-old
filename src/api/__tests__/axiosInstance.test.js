import axiosInstance from '../axiosInstance';
import { authStore } from '@store/authStore';
import { LogoutReset } from '@provider/RootNavigation';
import { showToast } from '@utils/toastService';
import MockAdapter from 'axios-mock-adapter';

jest.mock('@store/authStore', () => ({
  authStore: {
    token: 'fake-token',
    logout: jest.fn(),
  },
}));

jest.mock('@provider/RootNavigation', () => ({
  LogoutReset: jest.fn(),
}));

jest.mock('@utils/toastService', () => ({
  showToast: jest.fn(),
}));

describe('axiosInstance Interceptor', () => {
  let mock;

  beforeAll(() => {
    // This sets the mock adapter on the default instance
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('attaches authorization header if token exists', async () => {
    mock.onGet('/test-auth').reply(200, { success: true });

    const response = await axiosInstance.get('/test-auth');

    expect(response.config.headers.Authorization).toBe('Bearer fake-token');
    expect(response.data.success).toBe(true);
  });

  it('triggers logout and navigation reset on 401 response', async () => {
    mock.onGet('/test-401').reply(401, { message: 'Session Expired' });

    await expect(axiosInstance.get('/test-401')).rejects.toEqual({
      message: 'Session Expired',
    });

    expect(authStore.logout).toHaveBeenCalled();
    expect(LogoutReset).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith({
      message: 'Session Expired',
      type: 'error',
    });
  });

  it('shows error toast for standard 400 response without logging out', async () => {
    mock.onGet('/test-400').reply(400, { message: 'Bad Request' });

    await expect(axiosInstance.get('/test-400')).rejects.toEqual({
      message: 'Bad Request',
    });

    expect(authStore.logout).not.toHaveBeenCalled();
    expect(LogoutReset).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith({
      message: 'Bad Request',
      type: 'error',
    });
  });
});
