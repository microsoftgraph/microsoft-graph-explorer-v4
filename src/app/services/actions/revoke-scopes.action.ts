import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApplicationState } from '../../../store';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { IOAuthGrantPayload } from '../../../types/permissions';
import { IUser } from '../../../types/profile';
import { RevokeScopesError } from '../../utils/error-utils/RevokeScopesError';
import { translateMessage } from '../../utils/translate-messages';
import { DEFAULT_USER_SCOPES, REVOKING_PERMISSIONS_REQUIRED_SCOPES } from '../graph-constants';
import { getConsentedScopesSuccess } from '../slices/auth.slice';
import { setQueryResponseStatus } from '../slices/query-status.slice';
import { REVOKE_STATUS, RevokePermissionsUtil } from './permissions-action-creator.util';

interface IPermissionUpdate {
  permissionBeingRevokedIsAllPrincipal: boolean;
  userIsTenantAdmin: boolean;
  revokePermissionUtil: RevokePermissionsUtil;
  grantsPayload: IOAuthGrantPayload;
  profile: IUser;
  permissionToRevoke: string;
  newScopesArray: string[];
  retryCount: number;
  retryDelay: number;
  dispatch: Function;
}

export const revokeScopes = createAsyncThunk(
  'auth/revokeScopes',
  async (permissionToRevoke: string, { dispatch, getState, rejectWithValue }) => {
    const { auth: { consentedScopes }, profile } = getState() as ApplicationState;
    const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
    const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');

    dispatchScopesStatus(dispatch, 'Please wait while we revoke this permission', 'Revoking ', 0);
    const revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.user!.id!);

    if (!consentedScopes || consentedScopes.length === 0) {
      trackRevokeConsentEvent(REVOKE_STATUS.preliminaryChecksFail, permissionToRevoke);
      return rejectWithValue('No consented scopes found');
    }

    const newScopesArray: string[] = consentedScopes.filter((scope: string) => scope !== permissionToRevoke);

    try {
      const { userIsTenantAdmin, permissionBeingRevokedIsAllPrincipal, grantsPayload } = await revokePermissionUtil
        .getUserPermissionChecks({ consentedScopes, requiredPermissions, defaultUserScopes, permissionToRevoke });

      const retryCount = 0;
      const retryDelay = 100;
      const permissionsUpdateObject: IPermissionUpdate = {
        permissionBeingRevokedIsAllPrincipal,
        userIsTenantAdmin,
        revokePermissionUtil,
        grantsPayload,
        profile: profile.user!,
        permissionToRevoke,
        newScopesArray,
        retryCount,
        dispatch,
        retryDelay
      };

      const updatedScopes = await updatePermissions(permissionsUpdateObject);

      if (updatedScopes) {
        dispatchScopesStatus(dispatch, 'Permission revoked', 'Success', 4);
        dispatch(getConsentedScopesSuccess(updatedScopes));
        trackRevokeConsentEvent(REVOKE_STATUS.success, permissionToRevoke);
        return updatedScopes;
      } else {
        throw new RevokeScopesError({
          errorText: 'Scopes not updated',
          statusText: 'An error occurred when unconsenting',
          status: '500',
          messageType: 1
        });
      }
    } catch (errorMessage: any) {
      if (errorMessage instanceof RevokeScopesError) {
        const { errorText, statusText, status, messageType } = errorMessage;
        dispatchScopesStatus(dispatch, statusText, status, messageType);
        const permissionObject = {
          permissionToRevoke,
          statusCode: statusText,
          status: errorText
        };
        trackRevokeConsentEvent(REVOKE_STATUS.failure, permissionObject);
        return rejectWithValue(errorMessage);
      } else {
        const { code, message } = errorMessage;
        trackRevokeConsentEvent(REVOKE_STATUS.failure, 'Failed to revoke consent');
        dispatchScopesStatus(dispatch, message ? message : 'Failed to revoke consent', code ? code : 'Failed', 1);
        return rejectWithValue(errorMessage);
      }
    }
  }
);

const dispatchScopesStatus = (dispatch: Function, statusText: string, status: string, messageType: number) => {
  dispatch(
    setQueryResponseStatus({
      statusText: translateMessage(status),
      status: translateMessage(statusText),
      ok: false,
      messageType
    })
  )
}

const trackRevokeConsentEvent = (status: string, permissionObject: any) => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    componentName: componentNames.REVOKE_PERMISSION_CONSENT_BUTTON,
    permissionObject,
    status
  });
}

async function updatePermissions(permissionsUpdateObject: IPermissionUpdate): Promise<string[] | null> {
  const {
    permissionBeingRevokedIsAllPrincipal, userIsTenantAdmin, revokePermissionUtil, grantsPayload,
    profile, permissionToRevoke, newScopesArray, retryCount, dispatch, retryDelay } = permissionsUpdateObject;
  let isRevokeSuccessful;
  const maxRetryCount = 7;
  const newScopesString = newScopesArray.join(' ');

  if (permissionBeingRevokedIsAllPrincipal && userIsTenantAdmin) {
    isRevokeSuccessful = await revokePermissionUtil.getUpdatedAllPrincipalPermissionGrant(grantsPayload,
      permissionToRevoke);
  } else {
    isRevokeSuccessful = await revokePermissionUtil.updateSinglePrincipalPermissionGrant(grantsPayload, profile,
      newScopesString);
  }

  if (isRevokeSuccessful) {
    return newScopesString.split(' ');
  }
  else if ((retryCount < maxRetryCount) && !isRevokeSuccessful) {
    await new Promise(resolve => setTimeout(resolve, retryDelay * 2));
    dispatchScopesStatus(dispatch, 'We are retrying the revoking operation', 'Retrying', 5);

    permissionsUpdateObject.retryCount += 1;
    return updatePermissions(permissionsUpdateObject);
  }
  else {
    return null;
  }
}