export interface IResource {
  segment: string;
  label: string[];
  children: IResource[];
}

export interface IResources {
  pending: boolean;
  data: IResource;
  error: any | null;
}