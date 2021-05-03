import { geLocale } from '../../appLocale';

export interface ICloud {
  locale: string;
  name: string;
  baseUrl: string;
  loginUrl: string;
}

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
  const localeValue = geLocale.toLowerCase();
  return clouds.find(k => k.locale === localeValue);
}