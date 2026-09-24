import { setToastRef, showToast } from '../toastService';

describe('toastService util', () => {
  it('warns if showToast is called before initialization', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    showToast({ message: 'test' });
    expect(spy).toHaveBeenCalledWith('Toast not initialized yet');
    spy.mockRestore();
  });

  it('calls the registered toast function when showToast is invoked', () => {
    const mockFn = jest.fn();
    setToastRef(mockFn);
    
    const params = { message: 'Hello', duration: 3000 };
    showToast(params);
    
    expect(mockFn).toHaveBeenCalledWith(params);
  });
});
