import { getErrorMessage } from '../errorHandler';

describe('errorHandler', () => {
  it('returns response data message if available', () => {
    const error = { response: { data: { message: 'Server error occurred' } } };
    expect(getErrorMessage(error)).toBe('Server error occurred');
  });

  it('returns error.message if response data message is not present', () => {
    const error = { message: 'Network Error' };
    expect(getErrorMessage(error)).toBe('Network Error');
  });

  it('returns default fallback message if neither is available', () => {
    expect(getErrorMessage({})).toBe('Something went wrong');
  });
});
