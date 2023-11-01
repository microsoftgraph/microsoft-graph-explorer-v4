export interface APIManifest {
  publisher: Publisher;
  apiDependencies: ApiDependencies;
}

interface Publisher {
  name: string;
  contactEmail: string;
}

export interface ApiDependencies {
  [key: string]: ApiDependency
}

interface ApiDependency {
  apiDescriptionUrl: string;
  apiDeploymentBaseUrl: string;
  apiDescriptionVersion: string;
  auth: Auth;
  baseUrl?: string;
  requests: ManifestRequest[];
}

interface Auth {
  clientIdentifier: string;
  access: Access[];
}

export interface Access {
  type: string;
  claims: Claims;
}

interface Claims {
  scp?: ClaimDetail;
  roles?: ClaimDetail
}

interface ClaimDetail {
  essential: boolean;
  values: string[];
}

export interface ManifestRequest {
  method: string;
  uriTemplate: string;
}
