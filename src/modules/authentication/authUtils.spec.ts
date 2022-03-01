import { getLoginType, getCurrentUri } from '../../../src/modules/authentication/authUtils';
import { LoginType } from '../../types/enums';

describe('Tests auth utils', () => {
  it('Returns valid login type', () => {
    expect(getLoginType()).toBe(LoginType.Popup);
  })
  it('Returns valid uri for current app', () => {
    expect(getCurrentUri()).toBeDefined();
  })
})