import { geLocale } from '../../appLocale';
import { ICloud } from '../../types/cloud';

export const clouds: ICloud[] = [{
  locale: 'de-de',
  name: 'German',
  baseUrl: 'https://graph.microsoft.de',
  loginUrl: 'https://login.microsoftonline.de'
},
{
  locale: 'zh-cn',
  name: 'China',
  baseUrl: 'https://microsoftgraph.chinacloudapi.cn',
  loginUrl: 'https://portal.azure.cn'
}, {
  locale: 'en-us',
  name: 'Canary',
  baseUrl: 'https://canary.graph.microsoft.com',
  loginUrl: 'https://login.microsoftonline.com'
}];

export function getCurrentCloud(): ICloud | undefined {
  const cloudName = localStorage.getItem('cloud');
  if (cloudName) {
    return getCloudProperties(cloudName);
  }
  return undefined;
}

export function getEligibleCloud(): ICloud | undefined {
  const localeValue = geLocale.toLowerCase();
  return clouds.find(k => k.locale === localeValue);
}

export function getCloudProperties(cloudName: string): ICloud | undefined {
  if (cloudName) {
    return clouds.find(k => k.name === cloudName)
  }
  return undefined;
}