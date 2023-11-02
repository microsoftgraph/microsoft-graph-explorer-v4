import { ValidationError } from '../../app/utils/error-utils/ValidationError';
import { ValidationService } from './validation-service';

const validUrls = [
  'https://graph.microsoft.com/v1.0/me/events',
  'https://graph.microsoft.com/me',

  // eslint-disable-next-line max-len
  'https://graph.microsoft.com/v1.0/me/messages/AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e-T7KzowPTAAAAAAEMAAAiIsqMbYjsT5e-T7KzowPTAAMCzwJpAAA=/',
  'https://graph.microsoft.com/v1.0/security/alerts?$filter=Category eq \'ransomware\'&$top=5',
  'https://graph.microsoft.com/v1.0/planner/plans/CONGZUWfGUu4msTgNP66e2UAAySi',
  'https://graph.microsoft.com/v1.0/me/onenote/sections/1f7ff346-c174-45e5-af38-294e51d9969a/pages',
  'https://graph.microsoft.com/v1.0/users(\'48d31887-5fad-4d73-a9f5-3c356e68a038\')',
  'https://graph.microsoft.com/beta/me/drive/root/delta(token=\'1230919asd190410jlka\')',
  // eslint-disable-next-line max-len
  'https://graph.microsoft.com/beta/items/getActivitiesByInterval(startDateTime=\'2017-01-01\',endDateTime=\'2017-01-03\',interval=\'day\')',
  'https://graph.microsoft.com/beta/me/drive/root:/FolderA/FileB.txt:/content',
  'https://graph.microsoft.com/v1.0/me/drive/root:/Test Folder',
  'https://graph.microsoft.com/v1.0/me/drive/root:/Encoded%20URL'
];

const invalidUrls = [
  'https://graph.microsoft.com/me+you',
  'https://graph.microsoft.com/v1.0/me/messages?$$select=id',
  'https://graph.microsoft.com/v1.0/me/drive/root:/Encoded%',
  'https://graph.microsoft.com/v1.0/me/drive/root:/Encoded%2'
];

/*
* These are valid URLs that fail without the trailing slash added to them.
*/

const forcedTrailingSlashes = [
  'https://graph.microsoft.com/beta/directory/deleteditems/microsoft.graph.group/',
  'https://graph.microsoft.com/v1.0/me/photo/$value/',
  'https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/healthOverviews/$count/',
  'https://graph.microsoft.com/v1.0/me/drive/root:/book1.xlsx/',
  'https://graph.microsoft.com/v1.0/planner/tasks/oIx3zN98jEmVOM-4mUJzSGUANeje/',
  'https://graph.microsoft.com/v1.0/users/MiriamG@M365x214355.onmicrosoft.com/',
  'https://graph.microsoft.com/v1.0/me/extensions/com.contoso.roamingSettings/',
  'https://graph.microsoft.com/v1.0/applications_v2/02bd9fd6-8f93-4758-87c3-1fb73740a315/',
  'https://graph.microsoft.com/beta/groups/02bd9fd6-8f93-4758-87c3-1fb73740a315/owners/$ref/',
  // eslint-disable-next-line max-len
  'https://graph.microsoft.com/v1.0/teams/02bd9fd6-8f93-4758-87c3-1fb73740a315/channels/19:09fc54a3141a45d0bc769cf506d2e079@thread.skype/'

]
describe('Abnf parser should', () => {
  validUrls.forEach((sample) => {
    it(`validate url: ${sample} should pass`, () => {
      let error = '';
      try {
        ValidationService.validate(sample, []);
      } catch (err) {
        const theError = err as ValidationError;
        error = theError.message;
      }
      expect(error).toBeFalsy();
    });
  });

  invalidUrls.forEach((sample) => {
    it(`validate url: ${sample} should fail`, () => {
      let error = '';
      try {
        ValidationService.validate(sample, []);
      } catch (err) {
        const theError = err as ValidationError;
        error = theError.message;
      }
      expect(error).toBeTruthy();
    });
  });

  forcedTrailingSlashes.forEach((sample) => {
    it(`validate url: ${sample} should pass`, () => {
      let error = '';
      try {
        ValidationService.validate(sample, []);
      } catch (err) {
        const theError = err as ValidationError;
        error = theError.message;
      }
      expect(error).toBeFalsy();
    });
  });

});