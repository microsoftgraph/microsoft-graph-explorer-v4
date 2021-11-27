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
}

export interface MethodObject {
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
  methods?: MethodObject[]
}

