import { INavLink } from '@fluentui/react';

export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

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
  data: IResource;
  error: Error | null;
}

export interface IResourceLink extends INavLink, Omit<ResourcePath, 'key'> {
  labels: IResourceLabel[];
  links: IResourceLink[];
}
export interface ResourcePath {
  paths: string[];
  name: string;
  type: ResourceLinkType;
  version?: string;
  method?: string;
  key?: string;
  url: string;
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
