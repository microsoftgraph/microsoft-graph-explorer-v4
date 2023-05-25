export interface APIManifest {
  publisher: Publisher;
  apiDependencies: ApiDependency[];
}

interface ApiDependency {
  apiDescripionUrl: string;
  auth: Auth;
  requests: ManifestRequest[];
}

export interface ManifestRequest {
  method: string;
  uriTemplate: string;
}

interface Auth {
  clientIdentifier: string;
  access: Access[];
}

export interface Access {
  type: 'Delegated' | 'Application';
  actions: string[];
}

interface Publisher {
  name: string;
  contactEmail: string;
}