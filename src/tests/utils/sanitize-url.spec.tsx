import { sanitizeQueryUrl } from "../../app/utils/query-url-sanitization";

describe('Sanitize Query Url should', () => {
  const list = [
    {
      check: 'without task id',
      url: 'https://graph.microsoft.com/v1.0/planner/tasks/oIx3zN98jEmVOM-4mUJzSGUANeje',
    },
    {
      check: 'without email',
      url: 'https://graph.microsoft.com/v1.0/users/MiriamG@M365x214355.onmicrosoft.com',
    },
    {
      check: 'without message id',
      url: 'https://graph.microsoft.com/v1.0/me/messages/AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e-T7KzowPTAAAAAAEMAAAiIsqMbYjsT5e-T7KzowPTAAMCzwJpAAA='
    }
  ];

  for (let index = 0; index < list.length; index++) {
    const element = list[index];

    it(`return url ${element.check}`, () => {
      const normalizedUrl = sanitizeQueryUrl(element.url);
      expect(normalizedUrl).not.toEqual(element.url);
    });

  }

});