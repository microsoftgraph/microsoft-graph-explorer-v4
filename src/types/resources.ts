export interface IResource {
  segment: string;
  labels: Label[];
  children: IResource[];
}

export interface Label {
  name: string;
  methods: string[];
}

export interface IResources {
  pending: boolean;
  data: IResource;
  error: any | null;
}