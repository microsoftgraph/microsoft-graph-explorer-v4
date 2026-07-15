import { METHOD_COLORS } from './SidebarUtils';

jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

describe('SidebarUtils', () => {
  describe('METHOD_COLORS', () => {
    it('should have brand color for GET', () => {
      expect(METHOD_COLORS.GET).toBe('brand');
    });

    it('should have success color for POST', () => {
      expect(METHOD_COLORS.POST).toBe('success');
    });

    it('should have severe color for PATCH', () => {
      expect(METHOD_COLORS.PATCH).toBe('severe');
    });

    it('should have danger color for DELETE', () => {
      expect(METHOD_COLORS.DELETE).toBe('danger');
    });

    it('should have warning color for PUT', () => {
      expect(METHOD_COLORS.PUT).toBe('warning');
    });
  });
});
