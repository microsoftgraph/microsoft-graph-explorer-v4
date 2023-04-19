import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { IOAuthGrantPayload, IPermissionGrant } from '../../../types/permissions';
import { IUser } from '../../../types/profile';
import { IQuery } from '../../../types/query-runner';
import { RevokeScopesError } from '../../utils/error-utils/RevokeScopesError';
import { GRAPH_URL } from '../graph-constants';
import { exponentialFetchRetry, makeGraphRequest, parseResponse } from './query-action-creator-util';

interface IPreliminaryChecksObject {
  defaultUserScopes: string[];
  requiredPermissions: string[];
  consentedScopes: string[];
  permissionToRevoke: string;
  grantsPayload?: IOAuthGrantPayload;
}

type PartialCheckObject = Omit<IPreliminaryChecksObject, 'grantsPayload'>

const genericQuery: IQuery = {
  selectedVerb: 'GET',
  sampleHeaders: [],
  selectedVersion: '',
  sampleUrl: ''
};

export enum REVOKE_STATUS {
  success = 'success',
  failure = 'failure',
  preliminaryChecksFail = 'preliminaryChecksFail',
  allPrincipalScope = 'allPrincipalScope'
}
export class RevokePermissionsUtil {

  private servicePrincipalAppId: string;
  private grantsPayload: IOAuthGrantPayload;
  private signedInGrant: IPermissionGrant;
  private permissionToRevoke: string = '';
  private updatedPrincipalScopes: string[] = [];
  private updatedAllPrincipalScopes: string[] = [];

  private constructor(servicePrincipalAppId: string, grantsPayload: IOAuthGrantPayload,
    signedInGrant: IPermissionGrant, ) {
    this.servicePrincipalAppId = servicePrincipalAppId;
    this.grantsPayload = grantsPayload;
    this.signedInGrant = signedInGrant;
  }

  static async initialize(profileId: string) {
    const servicePrincipalAppId = await RevokePermissionsUtil.getServicePrincipalId([]);
    const grantsPayload = await RevokePermissionsUtil.getTenantPermissionGrants([], servicePrincipalAppId);
    const signedInGrant = RevokePermissionsUtil.getSignedInPrincipalGrant(grantsPayload, profileId);
    return new RevokePermissionsUtil(servicePrincipalAppId, grantsPayload, signedInGrant);
  }

  public preliminaryChecksSuccess(preliminaryChecksObject: IPreliminaryChecksObject) {
    const { defaultUserScopes, requiredPermissions, consentedScopes, permissionToRevoke, grantsPayload }
      = preliminaryChecksObject
    this.permissionToRevoke = permissionToRevoke;
    if (this.userRevokingDefaultScopes(defaultUserScopes, permissionToRevoke)) {
      throw new RevokeScopesError({
        errorText: 'Revoking default scopes',
        statusText: 'Cannot delete default scope',
        status: 'Default scope',
        messageType: 1
      })
    }

    if (!this.userHasRequiredPermissions(requiredPermissions, consentedScopes, grantsPayload!)) {
      throw new RevokeScopesError({
        errorText: 'Revoking admin granted scopes',
        statusText: 'Unable to dissentYou require the following permissions to revoke',
        status: 'Unable to dissent',
        messageType: 1
      })
    }
  }

  private userRevokingDefaultScopes(defaultUserScopes: string[], permissionToRevoke: string) {
    return defaultUserScopes.includes(permissionToRevoke);
  }

  public userRevokingAdminGrantedScopes(grantsPayload: IOAuthGrantPayload, permissionToRevoke: string) {
    if (!grantsPayload) {
      return false;
    }
    const allPrincipalGrants = grantsPayload.value.find((grant: IPermissionGrant) =>
      grant.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase());
    if (allPrincipalGrants && allPrincipalGrants.scope.includes(permissionToRevoke)) {
      return true
    }
    return false;
  }

  // We have to check if the required permissions are in the allPrincipal and single principal scopes
  // because of a bug in AAD that causes the principal scopes to temporarily miss allPrincipal scopes
  private userHasRequiredPermissions(requiredPermissions: string[], consentedScopes: string[],
    grantsPayload: IOAuthGrantPayload) {
    const allPrincipalGrants = grantsPayload.value.find((grant: IPermissionGrant) =>
      grant.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase());
    if (!allPrincipalGrants) {
      return requiredPermissions.every(scope => consentedScopes.includes(scope));
    }
    const allPrincipalScopes = allPrincipalGrants.scope.split(' ');
    let principalAndAllPrincipalScopes: string[] = [];
    principalAndAllPrincipalScopes = consentedScopes.concat(allPrincipalScopes);
    return requiredPermissions.every(scope => principalAndAllPrincipalScopes.includes(scope));
  }

  public static async isSignedInUserTenantAdmin(): Promise<boolean> {
    const tenantAdminQuery = { ...genericQuery };
    tenantAdminQuery.sampleUrl = `${GRAPH_URL}/v1.0/me/memberOf`;
    const response = await RevokePermissionsUtil.makeExponentialFetch([], tenantAdminQuery);
    return response ? response.value.some((value: any) => value.displayName === 'Global Administrator') : false
  }

  public async getUserPermissionChecks(preliminaryObject: PartialCheckObject): Promise<{
    userIsTenantAdmin: boolean, permissionBeingRevokedIsAllPrincipal: boolean, grantsPayload: IOAuthGrantPayload
  }> {
    const { permissionToRevoke } = preliminaryObject;
    const grantsPayload = this.getGrantsPayload();
    const signedInGrant = this.getSignedInGrant();
    const preliminaryChecksObject: IPreliminaryChecksObject = {
      ...preliminaryObject, grantsPayload
    }
    const allPrincipalGrants = RevokePermissionsUtil.getAllPrincipalGrant(grantsPayload);

    this.preliminaryChecksSuccess(preliminaryChecksObject)

    const userIsTenantAdmin = await RevokePermissionsUtil.isSignedInUserTenantAdmin();
    const permissionBeingRevokedIsAllPrincipal = this.userRevokingAdminGrantedScopes(grantsPayload, permissionToRevoke);

    if (permissionBeingRevokedIsAllPrincipal && !userIsTenantAdmin) {
      this.trackRevokeConsentEvent(REVOKE_STATUS.allPrincipalScope, permissionToRevoke);
      throw new RevokeScopesError({
        errorText: 'Revoking admin granted scopes',
        statusText: 'You are unconsenting to an admin pre-consented permission',
        status: 'Revoking admin granted scopes',
        messageType: 1
      })
    }

    if (!this.permissionToRevokeInGrant(signedInGrant, allPrincipalGrants, permissionToRevoke) && userIsTenantAdmin) {
      this.trackRevokeConsentEvent(REVOKE_STATUS.allPrincipalScope, permissionToRevoke);
      throw new RevokeScopesError({
        errorText: 'Permission propagation delay',
        statusText: 'You cannot revoke permissions not in your scopes', status: 'Permission propagation delay',
        messageType: 1
      })
    }
    return { userIsTenantAdmin, permissionBeingRevokedIsAllPrincipal, grantsPayload };
  }

  public async updateSinglePrincipalPermissionGrant(grantsPayload: IOAuthGrantPayload, profile: IUser,
    newScopesString: string) {
    const permissionGrantId = RevokePermissionsUtil.getSignedInPrincipalGrant(grantsPayload, profile.id).id;
    const isRevokeSuccessful = await this.revokePermission(permissionGrantId!, newScopesString);
    return isRevokeSuccessful;
  }

  public async getUpdatedAllPrincipalPermissionGrant(grantsPayload: IOAuthGrantPayload, permissionToRevoke: string) {
    const allPrincipalGrant = RevokePermissionsUtil.getAllPrincipalGrant(grantsPayload);
    const updatedScopes = allPrincipalGrant.scope.split(' ').filter((scope: string) => scope !== permissionToRevoke);
    const isRevokeSuccessful = await this.revokePermission(allPrincipalGrant.id!, updatedScopes.join(' '));
    return isRevokeSuccessful;
  }

  private static getAllPrincipalGrant(grantsPayload: IOAuthGrantPayload): IPermissionGrant {
    const emptyGrant: IPermissionGrant = {
      id: '',
      consentType: '',
      scope: '',
      clientId: '',
      principalId: '',
      resourceId: ''
    }
    if (!grantsPayload) { return emptyGrant }

    return grantsPayload.value.find((grant: any) =>
      grant.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase()) || emptyGrant;
  }

  public static getSignedInPrincipalGrant = (grantsPayload: IOAuthGrantPayload, userId: string) => {
    if (grantsPayload && grantsPayload.value.length > 1) {
      const filteredResponse = grantsPayload.value.find((permissionGrant: IPermissionGrant) =>
        permissionGrant.principalId === userId);
      return filteredResponse!;
    }
    return grantsPayload.value[0];
  }

  public static async getTenantPermissionGrants(scopes: string[], servicePrincipalAppId: string)
    : Promise<IOAuthGrantPayload> {
    if (!servicePrincipalAppId) { return { value: [], '@odata.context': '' } }
    genericQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`;
    genericQuery.sampleHeaders = [{ name: 'ConsistencyLevel', value: 'eventual' }];
    const oAuthGrant = await RevokePermissionsUtil.makeExponentialFetch(scopes, genericQuery);
    return oAuthGrant;
  }

  public permissionToRevokeInGrant(permissionsGrant: IPermissionGrant, allPrincipalGrant: IPermissionGrant,
    permissionToRevoke: string) {
    if (!permissionsGrant || !allPrincipalGrant) { return false }
    const allPrincipalPermissions = allPrincipalGrant.scope.split(' ');
    const principalPermissions = permissionsGrant.scope.split(' ');
    const combinedPermissions = [...allPrincipalPermissions, ...principalPermissions];
    return combinedPermissions.includes(permissionToRevoke);
  }

  public static async getServicePrincipalId(scopes: string[]): Promise<string> {
    const currentAppId = process.env.REACT_APP_CLIENT_ID;
    genericQuery.sampleUrl = `${GRAPH_URL}/v1.0/servicePrincipals?$filter=appId eq '${currentAppId}'`;
    const response = await this.makeNormalGraphRequest(scopes, genericQuery);
    return response ? response.value[0].id : '';
  }

  private async revokePermission(permissionGrantId: string, newScopes: string): Promise<boolean> {
    const oAuth2PermissionGrant = {
      scope: newScopes
    };
    const patchQuery = { ...genericQuery };
    patchQuery.sampleBody = JSON.stringify(oAuth2PermissionGrant);
    patchQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants/${permissionGrantId}`;
    genericQuery.sampleHeaders = [{ name: 'ConsistencyLevel', value: 'eventual' }];
    patchQuery.selectedVerb = 'PATCH';
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await RevokePermissionsUtil.makeExponentialFetch([], patchQuery,
        (result: any, retries?: number) => this.checkFor204StatusCode(result, retries!));
      const { error } = response;
      if (error && error.code === 'Request_BadRequest') {
        return true;
      }
      return false;
    }
    catch (error: any) {
      throw error;
    }
  }

  // This function checks whether a new PATCH is still successful. We are sure that
  // a permisison has been revoked when a PATCH returns an error 400
  private async checkFor204StatusCode(result: any, retries: number){
    if(result && result.status === 204){
      if(retries > 6){
        return false;
      }
      return true
    }
    return false;
  }


  private static async makeExponentialFetch(scopes: string[], query: IQuery, condition?:
  (args?: any) => Promise<boolean>) {
    const respHeaders: any = {};
    const response = await exponentialFetchRetry(() => makeGraphRequest(scopes)(query),
      8, 100, condition);
    return parseResponse(response, respHeaders);
  }

  private static async makeNormalGraphRequest(scopes: string[], query: IQuery) {
    const respHeaders: any = {};
    const response = await makeGraphRequest(scopes)(query);
    return parseResponse(response, respHeaders);
  }

  private trackRevokeConsentEvent = (status: string, permissionObject: any) => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      componentName: componentNames.REVOKE_PERMISSION_CONSENT_BUTTON,
      permissionObject,
      status
    });
  }

  public getServicePrincipalAppId() {
    return this.servicePrincipalAppId
  }

  public getGrantsPayload() {
    return this.grantsPayload
  }

  public getSignedInGrant() {
    return this.signedInGrant;
  }

}