import { AUTH_URL, GRAPH_URL } from '../../app/services/graph-constants';
import { geLocale } from '../../appLocale';
import { ICloud } from '../../types/cloud';

const storageKey = 'cloud';

export const clouds: ICloud[] = [
  {
    locale: 'en-us',
    name: 'China',
    baseUrl: 'https://microsoftgraph.chinacloudapi.cn',
    loginUrl: 'https://portal.azure.cn'
  },
  {
    locale: 'global',
    name: 'Canary',
    baseUrl: 'https://canary.graph.microsoft.com',
    loginUrl: 'https://login.microsoftonline.com'
  }
];

export const globalCloud: ICloud = {
  baseUrl: GRAPH_URL,
  locale: 'global',
  loginUrl: AUTH_URL,
  name: 'Global'
}

export function getCurrentCloud(): ICloud | undefined {
  const cloudName = localStorage.getItem(storageKey);
  return (cloudName) ? getCloudProperties(cloudName) : undefined;
}

export function getEligibleCloud(): ICloud | undefined {
  const localeValue = geLocale.toLowerCase();
  return clouds.find(k => k.locale === localeValue);
}

export function getCloudProperties(cloudName: string): ICloud | undefined {
  return clouds.find(k => k.name === cloudName) || undefined;
}

export function replaceBaseUrl(url: string): string {
  const { origin } = new URL(url);
  const currentCloud = getCurrentCloud() || null;
  const baseUrl = (currentCloud) ? currentCloud.baseUrl : globalCloud.baseUrl;
  return url.replace(origin, baseUrl);
}

export function storeCloudValue(value: string): void {
  localStorage.setItem(storageKey, value);
}