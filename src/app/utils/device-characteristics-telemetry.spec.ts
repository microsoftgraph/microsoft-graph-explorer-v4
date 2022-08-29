import { getDeviceScreenScale, getDeviceScreenSize } from './device-characteristics-telemetry'

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
    expect(getDeviceScreenScale()).toBeTruthy();
  });

  it('should get device screen size', () => {
    const deviceWidth = 1367;
    const expectedScreenSize = 'xxl';
    expect(getDeviceScreenSize(deviceWidth)).toBe(expectedScreenSize);
  });
})

