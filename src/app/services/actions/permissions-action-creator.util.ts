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
  private static isGettingConsentType: boolean = false;
  private static consentedScopes: string[] = [];
  private static tenantGrantPayload: IOAuthGrantPayload;
  private static signedInProfileId: string;

  private constructor(servicePrincipalAppId: string, grantsPayload: IOAuthGrantPayload,
    signedInGrant: IPermissionGrant, isGettingConsentType?: boolean, consentedScopes?: string[]) {
    this.servicePrincipalAppId = servicePrincipalAppId;
    this.grantsPayload = grantsPayload;
    this.signedInGrant = signedInGrant;
    RevokePermissionsUtil.isGettingConsentType = isGettingConsentType ? isGettingConsentType : false;
    RevokePermissionsUtil.consentedScopes = consentedScopes ? consentedScopes : [];
  }

  static async initialize(profileId: string, isGettingConsentType?: boolean, consentedScopes?: string[]) {
    const servicePrincipalAppId = await RevokePermissionsUtil.getServicePrincipalId([]);
    const grantsPayload = await RevokePermissionsUtil.getTenantPermissionGrants([], servicePrincipalAppId);
    const signedInGrant = RevokePermissionsUtil.getSignedInPrincipalGrant(grantsPayload, profileId!);
    RevokePermissionsUtil.signedInProfileId = profileId;
    return new RevokePermissionsUtil(servicePrincipalAppId, grantsPayload, signedInGrant, isGettingConsentType,
      consentedScopes);
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
    const response = await RevokePermissionsUtil.makePermissionsRequest([], tenantAdminQuery);
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

    if (!this.permissionToRevokeInGrant(signedInGrant, permissionToRevoke) && userIsTenantAdmin) {
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
    const servicePrincipalAppId = await RevokePermissionsUtil.getServicePrincipalId([]);
    const permissionGrantId = RevokePermissionsUtil.getSignedInPrincipalGrant(grantsPayload, profile.id).id;
    await this.revokePermission(permissionGrantId!, newScopesString);
    const response = await RevokePermissionsUtil.getTenantPermissionGrants([], servicePrincipalAppId);
    const principalGrant = RevokePermissionsUtil.getSignedInPrincipalGrant(response, profile.id);
    const updatedScopes = principalGrant.scope.split(' ');
    this.updatedPrincipalScopes = updatedScopes;
    return updatedScopes;
  }

  public async getUpdatedAllPrincipalPermissionGrant(grantsPayload: IOAuthGrantPayload, permissionToRevoke: string) {
    const servicePrincipalAppId = await RevokePermissionsUtil.getServicePrincipalId([]);
    const allPrincipalGrant = RevokePermissionsUtil.getAllPrincipalGrant(grantsPayload);
    const updatedScopes = allPrincipalGrant.scope.split(' ').filter((scope: string) => scope !== permissionToRevoke);
    await this.revokePermission(allPrincipalGrant.id!, updatedScopes.join(' '));
    const response = await RevokePermissionsUtil.getTenantPermissionGrants([], servicePrincipalAppId);
    const allPrincipalScopes = RevokePermissionsUtil.getAllPrincipalGrant(response).scope.split(' ');
    this.updatedAllPrincipalScopes = allPrincipalScopes;
    return allPrincipalScopes;
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
    const oAuthGrant = await RevokePermissionsUtil.makePermissionsRequest(scopes, genericQuery);
    RevokePermissionsUtil.tenantGrantPayload = oAuthGrant;
    return oAuthGrant;
  }

  public permissionToRevokeInGrant(permissionsGrant: IPermissionGrant, permissionToRevoke: string) {
    if (!permissionsGrant) { return false }
    return permissionsGrant.scope.split(' ').includes(permissionToRevoke);
  }

  public static async getServicePrincipalId(scopes: string[]): Promise<string> {
    const currentAppId = process.env.REACT_APP_CLIENT_ID;
    genericQuery.sampleUrl = `${GRAPH_URL}/v1.0/servicePrincipals?$filter=appId eq '${currentAppId}'`;
    const response = await this.makePermissionsRequest(scopes, genericQuery);
    return response ? response.value[0].id : '';
  }

  private async revokePermission(permissionGrantId: string, newScopes: string) {
    const oAuth2PermissionGrant = {
      scope: newScopes
    };
    const patchQuery = { ...genericQuery };
    patchQuery.sampleBody = JSON.stringify(oAuth2PermissionGrant);
    patchQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants/${permissionGrantId}`;
    patchQuery.selectedVerb = 'PATCH';
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await RevokePermissionsUtil.makePermissionsRequest([],
        patchQuery, () => this.permissionRevokedAvailable());
      const { error } = response;
      if (error) {
        throw error;
      }
    }
    catch (error: any) {
      throw error;
    }
  }

  private async permissionRevokedAvailable(){
    const combinedScopes = [...this.updatedPrincipalScopes, ...this.updatedAllPrincipalScopes];
    return Promise.resolve(combinedScopes.includes(this.permissionToRevoke));
  }

  private static async allPermissionsHaveConsentType(): Promise<boolean>{
    const allPrincipalGrants: string[] = RevokePermissionsUtil.getAllPrincipalGrant(RevokePermissionsUtil.
      tenantGrantPayload).scope.split(' ');
    const singlePrincipalGrants: string[] = RevokePermissionsUtil.getSignedInPrincipalGrant(RevokePermissionsUtil.
      tenantGrantPayload, RevokePermissionsUtil.signedInProfileId).scope.split(' ');
    const combinedPermissions = [...singlePrincipalGrants, allPrincipalGrants];
    const result = this.consentedScopes.every(scope => combinedPermissions.includes(scope));
    console.log('Here is the result now ', result);
    return Promise.resolve(!result);
  }

  private static async makePermissionsRequest(scopes: string[], query: IQuery, condition?: () => Promise<boolean>) {
    const respHeaders: any = {};
    if (this.isGettingConsentType) {
      condition = () => this.allPermissionsHaveConsentType();
    }
    const response = await exponentialFetchRetry(() => makeGraphRequest(scopes)(query),
      8, 100, condition);
    // const response = await makeGraphRequest(scopes)(query);
    return parseResponse(response, respHeaders);
  }

  private static async makeNormalPermissionsRequest(scopes: string[], query: IQuery){
    const response = makeGraphRequest(scopes)(query);
    return parseResponse(response);
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