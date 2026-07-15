const mockDispatch = jest.fn();

jest.mock('../../store', () => ({
  useAppDispatch: () => mockDispatch
}));
jest.mock('../services/slices/sidebar-properties.slice', () => ({
  toggleSidebar: jest.fn((payload: any) => ({ type: 'sidebar/toggle', payload }))
}));

import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useDetectMobileScreen } from './useDetectMobileScreen';

describe('useDetectMobileScreen', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true });
    jest.clearAllMocks();
  });

  it('dispatches mobile state for narrow screens', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    renderHook(() => useDetectMobileScreen());
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { showSidebar: false, mobileScreen: true } })
    );
  });

  it('dispatches desktop state for wide screens', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    renderHook(() => useDetectMobileScreen());
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { showSidebar: true, mobileScreen: false } })
    );
  });

  it('responds to resize events', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    renderHook(() => useDetectMobileScreen());
    mockDispatch.mockClear();

    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { showSidebar: false, mobileScreen: true } })
    );
  });
});
