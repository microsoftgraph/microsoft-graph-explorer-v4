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

export interface IResourceMethod {
  name: string;
  checked: boolean;
}

export interface IResourceLink extends INavLink {
  labels: IResourceLabel[];
  parent: string;
  level: number;
  paths: string[];
  type: string;
  links: IResourceLink[];
  version?: string;
  methods?: IResourceMethod[]
}

export enum ResourceOptions {
  ADD_TO_COLLECTION = 'add-to-collection',
  SHOW_QUERY_PARAMETERS = 'show-query-parameters'
}

