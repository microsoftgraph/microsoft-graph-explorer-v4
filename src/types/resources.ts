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