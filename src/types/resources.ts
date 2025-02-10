export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type Version = 'v1.0' | 'beta';
export interface IResource {
  segment: string;
  labels: IResourceLabel[];
  children?: IResource[];
}

export interface IResourceLabel {
  name: string;
  methods: ResourceMethod[] | string[];
}

export interface ResourceMethod {
  name: Method;
  documentationUrl?: string | null;
}

export interface IResources {
  pending: boolean;
  data: { [version: string]: IResource };
  error: Error | null;
}

export interface IResourceLink extends Omit<ResourcePath, 'key'> {
  labels: IResourceLabel[];
  links: IResourceLink[];
  key: string;
  name: string;
  url: string;
  isExpanded: boolean;
  parent: string;
  level: number;
  paths: string[];
  method?: string;
  type: ResourceLinkType;
  docLink?: string;
  count?: number | null;
  isInCollection?: boolean;
}

export interface ResourcePath {
  paths: string[];
  name: string;
  type: ResourceLinkType;
  version?: string;
  method?: string;
  key?: string;
  url: string;
  scope?: string;
}

export enum ResourceLinkType {
  NODE = 'node',
  FUNCTION = 'function',
  PATH = 'path'
}

export enum ResourceOptions {
  ADD_TO_COLLECTION = 'add-to-collection',
  REMOVE_FROM_COLLECTION = 'remove-from-collection'
}

export interface Collection {
  id: string;
  name: string;
  paths: ResourcePath[],
  isDefault?: boolean;
}

export interface CollectionPermission {
  value: string;
  scopeType: string;
  consentDisplayName: string;
  consentDescription: string;
  isAdmin: boolean;
  isLeastPrivilege: boolean;
  isHidden: boolean;
}
