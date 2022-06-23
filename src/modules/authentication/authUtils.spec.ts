import { LoginType } from '../../types/enums';
import { getLoginType, getCurrentUri } from './authUtils';

describe('Auth utils should', () => {
  it('return valid login type', () => {
    expect(getLoginType()).toBe(LoginType.Popup);
  })
  it('return valid uri for current app', () => {
    expect(getCurrentUri()).toBeDefined();
  })
})