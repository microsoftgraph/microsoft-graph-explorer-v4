import { ValidatedUrl } from './abnf';


describe('Abnf parser should', () => {
  const urls = [
    { url: 'https://graph.microsoft.com/v1.0/me/events', isValid: true },
    { url: 'https://graph.microsoft.com/me', isValid: true },
    {
      url:
        // eslint-disable-next-line max-len
        'https://graph.microsoft.com/v1.0/me/contacts?$filter=emailAddresses/any(a:a/address eq \'Alex@FineArtSchool.net\')',
      isValid: true
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/planner/tasks/oIx3zN98jEmVOM-4mUJzSGUANeje'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/users/MiriamG@M365x214355.onmicrosoft.com'
    },
    {
      isValid: true,
      // eslint-disable-next-line max-len
      url: 'https://graph.microsoft.com/v1.0/me/messages/AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e-T7KzowPTAAAAAAEMAAAiIsqMbYjsT5e-T7KzowPTAAMCzwJpAAA='
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/me/extensions/com.contoso.roamingSettings'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/planner/plans/CONGZUWfGUu4msTgNP66e2UAAySi'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/me/onenote/sections/1f7ff346-c174-45e5-af38-294e51d9969a/pages'
    },
    {
      isValid: true,
      // eslint-disable-next-line max-len
      url: 'https://graph.microsoft.com/v1.0/teams/02bd9fd6-8f93-4758-87c3-1fb73740a315/channels/19:09fc54a3141a45d0bc769cf506d2e079@thread.skype'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/applications_v2/02bd9fd6-8f93-4758-87c3-1fb73740a315'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/users(\'48d31887-5fad-4d73-a9f5-3c356e68a038\')'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/beta/groups/02bd9fd6-8f93-4758-87c3-1fb73740a315/owners/$ref'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/me/photo/$value'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/beta/devices/$count'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/beta/me/drive/root/delta(token=\'1230919asd190410jlka\')'
    },
    {
      isValid: true,
      // eslint-disable-next-line max-len
      url: 'https://graph.microsoft.com/beta/items/getActivitiesByInterval(startDateTime=\'2017-01-01\',endDateTime=\'2017- 01-03\',interval=\'day\')'
      // eslint-disable-next-line max-len
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/beta/directory/deleteditems/microsoft.graph.group'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/beta/me/drive/root:/FolderA/FileB.txt:/content'
    },
    {
      isValid: true,
      url: 'https://graph.microsoft.com/v1.0/me/drive/root:/book1.xlsx'
    }

  ];
  const validator = new ValidatedUrl();
  urls.forEach((sample) => {
    it(`validate the url: ${sample.url} to be ${sample.isValid} `, () => {
      const validation = validator.validate(sample.url);
      expect(validation.success).toBe(sample.isValid);
    });
  });

});