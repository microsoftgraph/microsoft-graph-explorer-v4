import {
  isDeprecation, sanitizeQueryUrl, isFunctionCall, encodeHashCharacters,
  sanitizeGraphAPISandboxUrl
} from './query-url-sanitization';

describe('isDepraction should ', () => {
  const list = [
    { key: 'messages_V2', deprecated: true },
    { key: 'messages', deprecated: false },
    { key: 'users_v2', deprecated: true },
    { key: 'users', deprecated: false }
  ];

  list.forEach(element => {
    it(`return ${element.deprecated} for ${element.key}`, () => {
      const key = isDeprecation(element.key);
      expect(key).toBe(element.deprecated);
    });
  });
});

describe('isFunctionCall', () => {
  it('should return true for function call pattern', () => {
    expect(isFunctionCall("users('some-id')")).toBe(true);
  });

  it('should return true for delta(token=value)', () => {
    expect(isFunctionCall("delta(token='123')")).toBe(true);
  });

  it('should return false for plain text', () => {
    expect(isFunctionCall('users')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isFunctionCall('')).toBe(false);
  });
});

describe('encodeHashCharacters', () => {
  it('should replace # with %2523 in sampleUrl', () => {
    const query = { sampleUrl: 'https://graph.microsoft.com/v1.0/me#section', selectedVerb: 'GET' } as any;
    expect(encodeHashCharacters(query)).toBe('https://graph.microsoft.com/v1.0/me%2523section');
  });

  it('should return empty string when sampleUrl is empty', () => {
    const query = { sampleUrl: '', selectedVerb: 'GET' } as any;
    expect(encodeHashCharacters(query)).toBe('');
  });

  it('should return empty string when sampleUrl is undefined', () => {
    const query = { selectedVerb: 'GET' } as any;
    expect(encodeHashCharacters(query)).toBe('');
  });

  it('should return url unchanged when no hash characters', () => {
    const query = { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET' } as any;
    expect(encodeHashCharacters(query)).toBe('https://graph.microsoft.com/v1.0/me');
  });

  it('should replace multiple hash characters', () => {
    const query = { sampleUrl: 'https://example.com/a#b#c', selectedVerb: 'GET' } as any;
    expect(encodeHashCharacters(query)).toBe('https://example.com/a%2523b%2523c');
  });
});

describe('sanitizeQueryUrl', () => {
  it('should return empty string for invalid URL', () => {
    expect(sanitizeQueryUrl('not-a-url')).toBe('');
  });
});

describe('sanitizeGraphAPISandboxUrl', () => {
  it('should sanitize the url query parameter', () => {
    const proxyUrl = 'https://proxy.example.com?url=https%3A%2F%2Fgraph.microsoft.com%2Fv1.0%2Fusers%2Fuser-id-123';
    const result = sanitizeGraphAPISandboxUrl(proxyUrl);
    expect(result).toContain('proxy.example.com');
  });

  it('should handle URL without url query parameter', () => {
    const proxyUrl = 'https://proxy.example.com?other=value';
    const result = sanitizeGraphAPISandboxUrl(proxyUrl);
    expect(result).toContain('proxy.example.com');
  });
});

describe('Sanitize Query Url should', () => {
  const list = [
    {
      check: 'without task id',
      url: 'https://graph.microsoft.com/v1.0/planner/tasks/oIx3zN98jEmVOM-4mUJzSGUANeje',
      sanitized: 'https://graph.microsoft.com/v1.0/planner/tasks/{tasks-id}'
    },
    {
      check: 'without email',
      url: 'https://graph.microsoft.com/v1.0/users/MiriamG@M365x214355.onmicrosoft.com',
      sanitized: 'https://graph.microsoft.com/v1.0/users/{users-id}'
    },
    {
      check: 'without message id',
      // eslint-disable-next-line max-len
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
      // eslint-disable-next-line max-len
      url: 'https://graph.microsoft.com/v1.0/teams/02bd9fd6-8f93-4758-87c3-1fb73740a315/channels/19:09fc54a3141a45d0bc769cf506d2e079@thread.skype',
      sanitized: 'https://graph.microsoft.com/v1.0/teams/{teams-id}/channels/{channels-id}'
    },
    {
      check: 'with deprecated resource and without id',
      url: 'https://graph.microsoft.com/v1.0/applications_v2/02bd9fd6-8f93-4758-87c3-1fb73740a315',
      sanitized: 'https://graph.microsoft.com/v1.0/applications_v2/{applications_v2-id}'
    },
    {
      check: 'with id within brackets',
      url: 'https://graph.microsoft.com/v1.0/users(\'48d31887-5fad-4d73-a9f5-3c356e68a038\')',
      sanitized: 'https://graph.microsoft.com/v1.0/users(<value>)'
    },
    {
      check: 'with $ref path segment',
      url: 'https://graph.microsoft.com/beta/groups/02bd9fd6-8f93-4758-87c3-1fb73740a315/owners/$ref',
      sanitized: 'https://graph.microsoft.com/beta/groups/{groups-id}/owners/$ref'
    },
    {
      check: 'with $value path segment',
      url: 'https://graph.microsoft.com/v1.0/me/photo/$value',
      sanitized: 'https://graph.microsoft.com/v1.0/me/photo/$value'
    },
    {
      check: 'with $count path segment',
      url: 'https://graph.microsoft.com/beta/devices/$count',
      sanitized: 'https://graph.microsoft.com/beta/devices/$count'
    },
    {
      check: 'with key-value parameter within path segment',
      url: 'https://graph.microsoft.com/beta/me/drive/root/delta(token=\'1230919asd190410jlka\')',
      sanitized: 'https://graph.microsoft.com/beta/me/drive/root/delta(token=<value>)'
    },
    {
      check: 'with multiple key-value parameters within path segment',
      // eslint-disable-next-line max-len
      url: 'https://graph.microsoft.com/beta/items/getActivitiesByInterval(startDateTime=\'2017-01-01\',endDateTime=\'2017- 01-03\',interval=\'day\')',
      // eslint-disable-next-line max-len
      sanitized: 'https://graph.microsoft.com/beta/items/getActivitiesByInterval(startDateTime=<value>,endDateTime=<value>,interval=<value>)'
    },
    {
      check: 'with segment preceded with microsoft.graph',
      url: 'https://graph.microsoft.com/beta/directory/deleteditems/microsoft.graph.group',
      sanitized: 'https://graph.microsoft.com/beta/directory/deleteditems/microsoft.graph.group'
    },
    {
      check: 'with relative path as segment',
      url: 'https://graph.microsoft.com/beta/me/drive/root:/FolderA/FileB.txt:/content',
      sanitized: 'https://graph.microsoft.com/beta/me/drive/root:<value>/content'
    },
    {
      check: 'with relative path as last segment',
      url: 'https://graph.microsoft.com/v1.0/me/drive/root:/book1.xlsx',
      sanitized: 'https://graph.microsoft.com/v1.0/me/drive/root:<value>'
    }
  ];

  list.forEach(element => {
    it(`return url ${element.check}`, () => {
      const sanitizedUrl = sanitizeQueryUrl(element.url);
      expect(sanitizedUrl).toEqual(element.sanitized);
    });
  });

});
