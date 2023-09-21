export interface APIManifest {
  publisher: Publisher;
  apiDependencies: ApiDependencies;
}

interface Publisher {
  name: string;
  contactEmail: string;
}

interface ApiDependencies {
  graph: ApiDependency;
}

interface ApiDependency {
  apiDescriptionUrl: string;
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
