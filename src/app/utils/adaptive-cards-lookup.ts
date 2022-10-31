import { IQuery } from '../../types/query-runner';
import { parseSampleUrl } from './sample-url-generation';
import { Groups, Profile, Users, Files, Messages, Site, Sites} from '../../adaptivecards-templates';

export function lookupTemplate(sampleQuery: IQuery): string {
  if (sampleQuery) {
    const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
    const query = requestUrl + search;
    // find if the url of the request has a template mapped to it
    for (const templateMapKey in templateMap) {
      if (Object.prototype.hasOwnProperty.call(templateMap, templateMapKey)) {
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
  '/groups': Groups,
  '/me': Profile,
  '/me/directReports': Users,
  '/me/drive/root/children': Files,
  '/me/drive/recent': Files,
  '/me/manager': Profile,
  '/me/memberOf': Groups,
  '/me/messages': Messages,
  '/sites/([^/?]+)': Site,
  '/sites/([^/?]+)/sites': Sites,
  '/users': Users,
  '/users/([^/?]+)': Profile
};
