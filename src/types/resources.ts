import { INavLink } from '@fluentui/react';

export interface IResource {
  segment: string;
  labels: IResourceLabel[];
  children: IResource[];
}

export interface IResourceLabel {
  name: string;
  methods: string[];
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
