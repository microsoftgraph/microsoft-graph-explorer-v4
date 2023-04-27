import { INavLink } from '@fluentui/react';

export type Method = 'Get' | 'Post' | 'Patch' | 'Put' | 'Delete';

export interface IResource {
  segment: string;
  labels: IResourceLabel[];
  children: IResource[];
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
  paths: IResourceLink[];
}

export interface IResourceLink extends INavLink {
  labels: IResourceLabel[];
  parent: string;
  level: number;
  paths: string[];
  type: ResourceLinkType;
  links: IResourceLink[];
  version?: string;
  method?: string;
}

export enum ResourceLinkType {
  NODE = 'node',
  FUNCTION = 'function',
  PATH = 'path'
}

export enum ResourceOptions {
  ADD_TO_COLLECTION = 'add-to-collection'
}

export interface Collection {
  id: string;
  name: string;
  paths: IResourceLink[],
  isDefault?: boolean;
}