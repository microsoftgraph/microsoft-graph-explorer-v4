import { IColumn } from '@fluentui/react';
import { ISampleQuery } from '../../../../types/query-runner';

export const columns: IColumn[] = [
  {
    key: 'button',
    name: '',
    fieldName: 'button',
    minWidth: 15,
    maxWidth: 25
  },
  {
    key: 'authRequiredIcon',
    name: '',
    fieldName: 'authRequiredIcon',
    minWidth: 20,
    maxWidth: 20
  },
  {
    key: 'method',
    name: '',
    fieldName: 'method',
    minWidth: 20,
    maxWidth: 50
  },
  {
    key: 'humanName',
    name: '',
    fieldName: 'humanName',
    minWidth: 100,
    maxWidth: 200
  }
];
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export function performSearch(queries: ISampleQuery[], value: string) {
  const keyword = value.toLowerCase();
  queries = queries.filter((sample: any) => {
    const name = sample.humanName.toLowerCase();
    const category = sample.category.toLowerCase();
    return name.includes(keyword) || category.includes(keyword);
  });
}
