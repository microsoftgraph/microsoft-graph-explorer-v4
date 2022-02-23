import { convertVhToPx, convertPxToVh, getResponseHeight } from './dimensions-adjustment';

describe('Tests dimension adjustments', () => {
  it('Converts vh to px', () => {
    const height = '90vh';
    const adjustment = 10;
    const newHeight = convertVhToPx(height, adjustment);
    expect(newHeight).toBe('-10px');
  });
  it('Converts px to vh', () => {
    const px = 890;
    const newHeight = convertPxToVh(px);
    expect(newHeight).toBe('115.88541666666667vh');
  });
  it('Gets response height', () => {
    const height = '90vh';
    const responseAreaExpanded = true;
    const newHeight = getResponseHeight(height, responseAreaExpanded);
    expect(newHeight).toBe('90vh');
  });
})