const mockDispatch = jest.fn();

jest.mock('../../store', () => ({
  useAppDispatch: () => mockDispatch
}));
jest.mock('../services/slices/sidebar-properties.slice', () => ({
  toggleSidebar: jest.fn(payload => ({ type: 'sidebar/toggle', payload }))
}));

import { act, renderHook } from '@testing-library/react';
import { useDetectMobileScreen } from './useDetectMobileScreen';

describe('useDetectMobileScreen', () => {
  const originalMatchMedia = window.matchMedia;
  let mediaQuery: {
    matches: boolean;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    mediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    window.matchMedia = jest.fn().mockReturnValue(mediaQuery);
    mockDispatch.mockClear();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it.each([true, false])('initializes responsive state when mobile is %s', matches => {
    mediaQuery.matches = matches;
    renderHook(() => useDetectMobileScreen());
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { showSidebar: !matches, mobileScreen: matches } })
    );
  });

  it('updates state only when the breakpoint changes', () => {
    renderHook(() => useDetectMobileScreen());
    mockDispatch.mockClear();
    mediaQuery.matches = true;
    act(() => mediaQuery.addEventListener.mock.calls[0][1]());
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { showSidebar: false, mobileScreen: true } })
    );
  });

  it('does not reset navigation on ordinary window resize events', () => {
    mediaQuery.matches = true;
    renderHook(() => useDetectMobileScreen());
    mockDispatch.mockClear();
    act(() => window.dispatchEvent(new Event('resize')));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('removes the breakpoint listener on unmount', () => {
    const { unmount } = renderHook(() => useDetectMobileScreen());
    unmount();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change', mediaQuery.addEventListener.mock.calls[0][1]
    );
  });
});
