import { Method } from './resources';

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
  clientId: string;
  permissions: Permissions;
}

interface Permissions {
  delegated: string[];
  application: string[];
}

interface Publisher {
  name: string;
  contactEmail: string;
}