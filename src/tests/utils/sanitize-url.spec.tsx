import {
  isAllAlpha, isDeprecation, sanitizeQueryParameterValue, sanitizeQueryUrl
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
    },
    {
      check: 'with deprecated resource and without id',
      url: 'https://graph.microsoft.com/v1.0/applications_v2/02bd9fd6-8f93-4758-87c3-1fb73740a315',
      sanitized: 'https://graph.microsoft.com/v1.0/applications_v2/{applications_v2-id}'
    },
    {
      check: 'with id within brackets',
      url: 'https://graph.microsoft.com/v1.0/users(\'48d31887-5fad-4d73-a9f5-3c356e68a038\')',
      sanitized: 'https://graph.microsoft.com/v1.0/users(users-id)'
    }
  ];

  list.forEach(element => {
    it(`return url ${element.check}`, () => {
      const sanitizedUrl = sanitizeQueryUrl(element.url);
      expect(sanitizedUrl).toEqual(element.sanitized);
    });
  });

});

describe('Sanitize Query Parameters should', () => {
  const list = [
    // $top
    {
      check: 'returns value as is when $top value is integer',
      queryParam: '$top=5',
      sanitizedQueryParam: '$top=5'
    },
    {
      check: 'returns <unexpected-value> when $top value is not integer',
      queryParam: '$top=five',
      sanitizedQueryParam: '$top=<unexpected-value>'
    },

    // $skip
    {
      check: 'returns value as is when $skip value is integer',
      queryParam: '$skip=5',
      sanitizedQueryParam: '$skip=5'
    },
    {
      check: 'returns <unexpected-value> when $skip value is not integer',
      queryParam: '$skip=ten',
      sanitizedQueryParam: '$skip=<unexpected-value>'
    },

    // $count
    {
      check: 'returns value as is when $count value is boolean true or false',
      queryParam: '$count=true',
      sanitizedQueryParam: '$count=true'
    },
    {
      check: 'returns <unexpected-value> when $count value is not boolean true or false',
      queryParam: '$count=who',
      sanitizedQueryParam: '$count=<unexpected-value>'
    },

    // $select
    {
      check: 'returns value as is when $select value is the star operator to request for all structural properties',
      queryParam: '$select=*',
      sanitizedQueryParam: '$select=*'
    },
    {
      check: 'returns value as is when $select value is requests for all actions/functions available for each entity',
      queryParam: '$select=People.*',
      sanitizedQueryParam: '$select=People.*'
    },
    {
      check: 'returns <unexpected-value> when $select value is not all alphabetic letters',
      queryParam: '$select=displayName123,mail',
      sanitizedQueryParam: '$select=<unexpected-value>,mail'
    },

    // $orderby
    {
      check: 'returns value as is when $orderby value contains alphabetic letters, comma and space',
      queryParam: '$orderby=officeLocation,displayName desc',
      sanitizedQueryParam: '$orderby=officeLocation,displayName desc'
    },
    {
      check: 'returns <unexpected-value> when $orderby value is not all alphabetic letters',
      queryParam: '$orderby=<unexpected-value> asc',
      sanitizedQueryParam: '$orderby=<unexpected-value> asc'
    },

    // $format
    {
      check: 'returns value as is when $format value is only alphabetic letters',
      queryParam: '$format=json',
      sanitizedQueryParam: '$format=json'
    },
    {
      check: 'returns value as is when $format value is media type in full and also requesting full metadata',
      queryParam: '$format=application/json;metadata=full',
      sanitizedQueryParam: '$format=application/json;metadata=full'
    },
    {
      check: 'returns <unexpected-value> when $format value contains characters that are not letters, semicolon or /',
      queryParam: '$format=json123',
      sanitizedQueryParam: '$format=<unexpected-value>'
    },

    // $skiptoken
    {
      check: 'returns <value> when $skiptoken value is provided',
      queryParam: '$skiptoken=<value>',
      sanitizedQueryParam: '$skiptoken=<value>'
    },

    // $deltatoken
    {
      check: 'returns <value> when $deltatoken value is provided',
      queryParam: '$deltatoken=<value>',
      sanitizedQueryParam: '$deltatoken=<value>'
    },

    // $search
    {
      check: 'returns <value> when simple $search value is provided',
      queryParam: '$search="pizza"',
      sanitizedQueryParam: '$search=<value>'
    },
    {
      check: 'returns "{property-name}:<value>" when $search value contains property name',
      queryParam: '$search="from:no-reply@microsoft.com"',
      sanitizedQueryParam: '$search="from:<value>"'
    },
    {
      check: 'returns <value> AND|OR <value> when $search value contains comparison operators',
      queryParam: '$search="pizza" OR "chicken"',
      sanitizedQueryParam: '$search=<value> OR <value>'
    },

    // $filter
    {
      check: 'returns <value> for operand of $filter operation',
      queryParam: '$filter=from/emailAddress/address eq \'no-reply@microsoft.com\'',
      sanitizedQueryParam: '$filter=from/emailAddress/address eq <value>'
    },
    {
      check: 'returns <value> for operand of $filter function operation',
      queryParam: '$filter=startsWith(displayName,\'J\')',
      sanitizedQueryParam: '$filter=startswith(displayName,<value>)'
    },

    // $expand
    {
      check: 'returns value as is for simple $expand value',
      queryParam: '$expand=children',
      sanitizedQueryParam: '$expand=children'
    },
    {
      check: 'returns sanitized value of inner OData query option within $expand value',
      queryParam: '$expand=children($filter=firstname eq \'mary\')',
      sanitizedQueryParam: '$expand=children($filter=firstname eq <value>)'
    },
    {
      check: 'returns property sanitized values for $expand value with multiple navigation properties',
      queryParam: '$expand=children($select=firstname),customers($top="five")',
      sanitizedQueryParam: '$expand=children($select=firstname),customers($top=<unexpected-value>)'
    },

    // regular query parameters
    {
      check: 'returns <value> when query parameter key is not OData and key is all letters',
      queryParam: 'firstname=Mary',
      sanitizedQueryParam: 'firstname=<value>'
    },
    {
      check: 'returns <key> when query parameter key is not OData and is not all letters',
      queryParam: 'someone@onmicrosoft.com=mail',
      sanitizedQueryParam: '<key>=<value>'
    },

  ];

  list.forEach(element => {
    it(`${element.check}`, () => {
      const sanitizedQueryParam = sanitizeQueryParameterValue(element.queryParam);
      expect(sanitizedQueryParam).toEqual(element.sanitizedQueryParam);
    });
  });

});