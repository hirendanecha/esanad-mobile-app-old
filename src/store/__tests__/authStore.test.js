import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore, authStore, useHydratedAuth } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      _hasHydrated: false,
      onBoarded: false,
      userDetailsUpdate: false,
    });
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state._hasHydrated).toBe(false);
    expect(state.onBoarded).toBe(false);
  });

  it('should update token and user via setAuth', () => {
    act(() => {
      useAuthStore.getState().setAuth({ token: 'test-token', user: { name: 'John Doe' } });
    });
    const state = useAuthStore.getState();
    
    expect(state.token).toBe('test-token');
    expect(state.user).toEqual({ name: 'John Doe' });
  });

  it('should update token via setToken', () => {
    act(() => {
      useAuthStore.getState().setToken('new-token');
    });
    expect(useAuthStore.getState().token).toBe('new-token');
  });

  it('should update user via setUser', () => {
    act(() => {
    useAuthStore.getState().setUser({ id: 123 });
    });
    expect(useAuthStore.getState().user).toEqual({ id: 123 });
  });

  it('should clear state on logout', () => {
    act(() => {
      useAuthStore.getState().setAuth({ token: 'test-token', user: { name: 'John Doe' } });
      useAuthStore.getState().setUserDetailsUpdate(true);
      useAuthStore.getState().logout();
    });
    
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.userDetailsUpdate).toBe(false);
  });

  describe('authStore wrapper object', () => {
    it('returns null for token and user if not hydrated', () => {
      act(() => {
        useAuthStore.setState({ _hasHydrated: false, token: 'hidden-token', user: { name: 'hidden' } });
      });
      expect(authStore.token).toBeNull();
      expect(authStore.user).toBeNull();
    });

    it('returns values if hydrated', () => {
      act(() => {
        useAuthStore.setState({ _hasHydrated: true, token: 'visible-token', user: { name: 'visible' } });
      });
      expect(authStore.token).toBe('visible-token');
      expect(authStore.user).toEqual({ name: 'visible' });
    });
  });

  describe('useHydratedAuth hook', () => {
    it('returns default layout when not hydrated', () => {
      act(() => {
        useAuthStore.setState({ _hasHydrated: false, token: 'abc', user: {} });
      });
      
      const { result } = renderHook(() => useHydratedAuth());
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isHydrated).toBe(false);
      expect(result.current.token).toBeNull();
    });

    it('returns actual state when hydrated', () => {
      act(() => {
        useAuthStore.setState({ _hasHydrated: true, token: 'abc', user: { id: 1 } });
      });
      
      const { result } = renderHook(() => useHydratedAuth());
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isHydrated).toBe(true);
      expect(result.current.token).toBe('abc');
      expect(result.current.user).toEqual({ id: 1 });
    });
  });
});
