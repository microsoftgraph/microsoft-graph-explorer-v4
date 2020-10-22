import {
  isAllAlpha, sanitizeQueryUrl
} from '../../app/utils/query-url-sanitization';


describe('isAllAlpha should ', () => {
  const list = [
    { key: 'aaa', isAllAlphabetic: true },
    { key: 'aZa', isAllAlphabetic: true },
    { key: '111', isAllAlphabetic: false },
    { key: '1a1', isAllAlphabetic: false }
  ];

  list.forEach(element => {
    it(`return ${element.isAllAlphabetic} for ${element.key}`, () => {
      const key = isAllAlpha(element.key);
      expect(key).toBe(element.isAllAlphabetic);
    });
  });
});

describe('Sanitize Query Url should', () => {
  const list = [
    {
      check: 'without task id',
      url: 'https://graph.microsoft.com/v1.0/planner/tasks/oIx3zN98jEmVOM-4mUJzSGUANeje',
      sanitized: 'https://graph.microsoft.com/v1.0/planner/tasks/{tasks-id}',
    },
    {
      check: 'without email',
      url: 'https://graph.microsoft.com/v1.0/users/MiriamG@M365x214355.onmicrosoft.com',
      sanitized: 'https://graph.microsoft.com/v1.0/users/{users-id}',
    },
    {
      check: 'without message id',
      // tslint:disable-next-line: max-line-length
      url: 'https://graph.microsoft.com/v1.0/me/messages/AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e-T7KzowPTAAAAAAEMAAAiIsqMbYjsT5e-T7KzowPTAAMCzwJpAAA=',
      sanitized: 'https://graph.microsoft.com/v1.0/me/messages/{messages-id}'
    },
    {
      check: 'without extension id',
      url: 'https://graph.microsoft.com/v1.0/me/extensions/com.contoso.roamingSettings',
      sanitized: 'https://graph.microsoft.com/v1.0/me/extensions/{extensions-id}'
    },
    {
      check: 'without plan id',
      url: 'https://graph.microsoft.com/v1.0/planner/plans/CONGZUWfGUu4msTgNP66e2UAAySi',
      sanitized: 'https://graph.microsoft.com/v1.0/planner/plans/{plans-id}'
    },
    {
      check: 'without section id',
      url: 'https://graph.microsoft.com/v1.0/me/onenote/sections/1f7ff346-c174-45e5-af38-294e51d9969a/pages',
      sanitized: 'https://graph.microsoft.com/v1.0/me/onenote/sections/{sections-id}/pages'
    },
    {
      check: 'with all parameters replaced',
      // tslint:disable-next-line: max-line-length
      url: 'https://graph.microsoft.com/v1.0/teams/02bd9fd6-8f93-4758-87c3-1fb73740a315/channels/19:09fc54a3141a45d0bc769cf506d2e079@thread.skype',
      sanitized: 'https://graph.microsoft.com/v1.0/teams/{teams-id}/channels/{channels-id}'
    }
  ];

  list.forEach(element => {
    it(`return url ${element.check}`, () => {
      const normalizedUrl = sanitizeQueryUrl(element.url);
      expect(normalizedUrl).toEqual(element.sanitized);
    });
  });

});