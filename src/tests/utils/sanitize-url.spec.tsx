import { sanitizeQueryUrl } from '../../app/utils/query-url-sanitization';

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
    }
  ];

  list.forEach(element => {
    it(`return url ${element.check}`, () => {
      const normalizedUrl = sanitizeQueryUrl(element.url);
      expect(normalizedUrl).toEqual(element.sanitized);
    });
  });

});