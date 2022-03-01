import { LoginType } from '../../types/enums';
import { getLoginType, getCurrentUri } from './authUtils';

describe('Tests auth utils', () => {
  it('Returns valid login type', () => {
    expect(getLoginType()).toBe(LoginType.Popup);
  })
  it('Returns valid uri for current app', () => {
    expect(getCurrentUri()).toBeDefined();
  })
})