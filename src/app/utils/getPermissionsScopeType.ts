import { IUser } from '../../types/profile';
import { ACCOUNT_TYPE, PERMS_SCOPE } from '../services/graph-constants';

export function getPermissionsScopeType(profile: IUser | null | undefined) {
  if (profile?.profileType === ACCOUNT_TYPE.MSA) {
    return PERMS_SCOPE.PERSONAL;
  }
  return PERMS_SCOPE.WORK;
}
