import { ISampleQuery } from '../../../../types/query-runner';

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
