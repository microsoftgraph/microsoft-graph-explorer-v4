import { getDeviceScreenScale, getBrowserScreenSize } from './device-characteristics-telemetry'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
describe('Device Telemetry', () => {
  it('should get device screen scale', () => {
    const percentage = '%';
    expect(getDeviceScreenScale()).toContain(percentage);
  });

  it('should get device screen size', () => {
    const deviceWidth = 1367;
    const expectedScreenSize = 'xxl';
    expect(getBrowserScreenSize(deviceWidth)).toBe(expectedScreenSize);
  });

  describe('getBrowserScreenSize - all breakpoints', () => {
    it('should return "xxxxl" for width >= 2560', () => {
      expect(getBrowserScreenSize(2560)).toBe('xxxxl');
      expect(getBrowserScreenSize(3000)).toBe('xxxxl');
    });

    it('should return "xxxl" for width >= 1920 and < 2560', () => {
      expect(getBrowserScreenSize(1920)).toBe('xxxl');
      expect(getBrowserScreenSize(2559)).toBe('xxxl');
    });

    it('should return "xxl" for width >= 1366 and < 1920', () => {
      expect(getBrowserScreenSize(1366)).toBe('xxl');
      expect(getBrowserScreenSize(1919)).toBe('xxl');
    });

    it('should return "xl" for width >= 1024 and < 1366', () => {
      expect(getBrowserScreenSize(1024)).toBe('xl');
      expect(getBrowserScreenSize(1365)).toBe('xl');
    });

    it('should return "l" for width >= 640 and < 1024', () => {
      expect(getBrowserScreenSize(640)).toBe('l');
      expect(getBrowserScreenSize(1023)).toBe('l');
    });

    it('should return "m" for width >= 480 and < 640', () => {
      expect(getBrowserScreenSize(480)).toBe('m');
      expect(getBrowserScreenSize(639)).toBe('m');
    });

    it('should return "s" for width < 480', () => {
      expect(getBrowserScreenSize(479)).toBe('s');
      expect(getBrowserScreenSize(0)).toBe('s');
      expect(getBrowserScreenSize(100)).toBe('s');
    });
  });

  describe('getDeviceScreenScale - various ratios', () => {
    it('should return "100%" for devicePixelRatio 1', () => {
      Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: 1 });
      expect(getDeviceScreenScale()).toBe('100%');
    });

    it('should return "200%" for devicePixelRatio 2', () => {
      Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: 2 });
      expect(getDeviceScreenScale()).toBe('200%');
    });

    it('should return "150%" for devicePixelRatio 1.5', () => {
      Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: 1.5 });
      expect(getDeviceScreenScale()).toBe('150%');
    });

    it('should register a change listener via matchMedia', () => {
      Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: 1 });
      getDeviceScreenScale();
      expect(window.matchMedia).toHaveBeenCalled();
    });
  });
})

