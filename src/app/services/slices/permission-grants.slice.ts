import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApplicationState } from '../../../store';
import { IPermissionGrant, PermissionGrantsState } from '../../../types/permissions';
import { IUser } from '../../../types/profile';
import { translateMessage } from '../../utils/translate-messages';
import { RevokePermissionsUtil } from '../actions/permissions-action-creator.util';
import { setQueryResponseStatus } from '../slices/query-status.slice';

const initialState: PermissionGrantsState = {
  pending: false,
  error: null,
  permissions: []
};

export const fetchAllPrincipalGrants = createAsyncThunk(
  'permissionGrants/fetchAllPrincipalGrants',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as ApplicationState;
      const { auth: { consentedScopes }, profile } = state;
      const revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.user!.id);

      if (revokePermissionUtil && revokePermissionUtil.getGrantsPayload() !== null) {
        const servicePrincipalAppId = revokePermissionUtil.getServicePrincipalAppId();
        const requestCounter = 0;

        const permissions = await checkScopesConsentType(servicePrincipalAppId, revokePermissionUtil,
          consentedScopes, profile.user!, requestCounter);
        return permissions;

      } else {
        dispatch(setQueryResponseStatus({
          statusText: translateMessage('Permissions'),
          status: translateMessage('You require the following permissions to read'),
          ok: false,
          messageType: 0
        }));
        throw new Error('Permission required');
      }
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);

const permissionGrantsSlice = createSlice({
  name: 'permissionGrants',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPrincipalGrants.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchAllPrincipalGrants.fulfilled, (state, action: PayloadAction<IPermissionGrant[]>) => {
        state.pending = false;
        state.permissions = action.payload;
      })
      .addCase(fetchAllPrincipalGrants.rejected, (state) => {
        state.pending = false;
      });
  }
});


const allScopesHaveConsentType = (consentedScopes: string[], permissions: IPermissionGrant[], id: string) => {
  const allPrincipalGrants: string[] = getAllPrincipalGrant(permissions);
  const singlePrincipalGrants: string[] = getSinglePrincipalGrant(permissions, id);
  const combinedPermissions = [...allPrincipalGrants, ...singlePrincipalGrants];
  return consentedScopes.every(scope => combinedPermissions.includes(scope));
}

export const getAllPrincipalGrant = (tenantWideGrant: IPermissionGrant[]): string[] => {
  if (tenantWideGrant) {
    const allGrants = tenantWideGrant;
    if (allGrants) {
      const principalGrant = allGrants.find(grant => grant.consentType === 'AllPrincipals');
      if (principalGrant) {
        return principalGrant.scope.split(' ');
      }
    }
  }
  return [];
}

export const getSinglePrincipalGrant = (tenantWideGrant: IPermissionGrant[], principalId: string): string[] => {
  if (tenantWideGrant && principalId) {
    const allGrants = tenantWideGrant;
    const singlePrincipalGrant = allGrants.find(grant => grant.principalId === principalId);
    if (singlePrincipalGrant) {
      return singlePrincipalGrant.scope.split(' ');
    }
  }
  return [];
}

async function checkScopesConsentType(servicePrincipalAppId: string, revokePermissionUtil: RevokePermissionsUtil,
  consentedScopes: string[], profile: IUser, requestCounter: number) {
  if (servicePrincipalAppId) {
    let grantsPayload = revokePermissionUtil.getGrantsPayload();
    if (grantsPayload) {
      if (!allScopesHaveConsentType(consentedScopes, grantsPayload.value, profile.id)) {
        while (requestCounter < 10 && profile && profile.id &&
          !allScopesHaveConsentType(consentedScopes, grantsPayload.value, profile.id)) {
          requestCounter += 1;
          await new Promise((resolve) => setTimeout(resolve, 400 * requestCounter));
          revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
          grantsPayload = revokePermissionUtil.getGrantsPayload();
        }
        return grantsPayload.value;
      } else {
        return grantsPayload.value;
      }
    }
  }
  return [];
}

export default permissionGrantsSlice.reducer;