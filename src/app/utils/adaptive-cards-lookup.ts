import { IQuery } from '../../types/query-runner';
import { parseSampleUrl } from './sample-url-generation';

export function lookupTemplate(sampleQuery: IQuery): string {
  if (sampleQuery) {
    const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
    const query = requestUrl + search;
    // find if the url of the request has a template mapped to it
    for (const templateMapKey in templateMap) {
      if (templateMap.hasOwnProperty(templateMapKey)) {
        // check if the template matches a specific pattern while ignoring case
        const isMatch = new RegExp(templateMapKey + '$', 'i').test('/' + query);
        if (isMatch) {
          return templateMap[templateMapKey];
        }
      }
    }
  }
  return '';
}

const templateMap: any = {
  '/groups': 'Groups.json',
  '/me': 'Profile.json',
  '/me/directReports': 'Users.json',
  '/me/drive/root/children': 'Files.json',
  '/me/drive/recent': 'Files.json',
  '/me/manager': 'Profile.json',
  '/me/memberOf': 'Groups.json',
  '/me/messages': 'Messages.json',
  '/sites/([^/?]+)': 'Site.json',
  '/sites/([^/?]+)/sites': 'Sites.json',
  '/users': 'Users.json',
  '/users/([^/?]+)': 'Profile.json'
};
