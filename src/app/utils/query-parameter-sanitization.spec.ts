import {
  isAllAlpha,
  isPropertyName,
  sanitizeQueryParameter,
  isAlphaNumeric,
  isPlaceHolderSegment
} from './query-parameter-sanitization';

describe('isAllAlpha should ', () => {
  const list = [
    { key: 'aaa', isAllAlphabetic: true },
    { key: 'aZa', isAllAlphabetic: true },
    { key: '111', isAllAlphabetic: false },
    { key: '1a1', isAllAlphabetic: false }
  ];

  list.forEach((element) => {
    it(`should return ${element.isAllAlphabetic} for ${element.key}`, () => {
      const key = isAllAlpha(element.key);
      expect(key).toBe(element.isAllAlphabetic);
    });
  });
});

describe('isPropertyOrEntityName should', () => {
  const list = [
    { key: 'userPrincipalName', isPropertyOrEntityName: true },
    { key: 'microsoft.graph.user', isPropertyOrEntityName: true },
    {
      key: 'microsoft.graph.windowsUpdates.qualityUpdateCatalogEntry',
      isPropertyOrEntityName: true
    },
    {
      key: 'microsoft.graph.windowsUpdates.qualityUpdateCatalogEntry/isExpeditable',
      isPropertyOrEntityName: true
    },
    {
      key: 'microsoft.graph.windowsUpdates.qualityUpdateCatalogEntry/isExpeditable/',
      isPropertyOrEntityName: false
    },
    {
      key: 'from/emailAddress/address',
      isPropertyOrEntityName: true
    },
    { key: '1234surname', isPropertyOrEntityName: false },
    { key: 'from/', isPropertyOrEntityName: false }
  ];

  list.forEach((element) => {
    it(`should return ${element.isPropertyOrEntityName} for ${element.key}`, () => {
      const key = isPropertyName(element.key);
      expect(key).toBe(element.isPropertyOrEntityName);
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
      check: 'returns <invalid-value> when $top value is not integer',
      queryParam: '$top=five',
      sanitizedQueryParam: '$top=<invalid-value>'
    },

    // $skip
    {
      check: 'returns value as is when $skip value is integer',
      queryParam: '$skip=5',
      sanitizedQueryParam: '$skip=5'
    },
    {
      check: 'returns <invalid-value> when $skip value is not integer',
      queryParam: '$skip=ten',
      sanitizedQueryParam: '$skip=<invalid-value>'
    },

    // $count
    {
      check: 'returns value as is when $count value is boolean true or false',
      queryParam: '$count=true',
      sanitizedQueryParam: '$count=true'
    },
    {
      check: 'returns <invalid-value> when $count value is not boolean true or false',
      queryParam: '$count=who',
      sanitizedQueryParam: '$count=<invalid-value>'
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
      check: 'returns <invalid-property> when $select value is not all alphabetic letters',
      queryParam: '$select=displayName123,mail',
      sanitizedQueryParam: '$select=<invalid-property>,mail'
    },

    // $orderby
    {
      check: 'returns value as is when $orderby value contains alphabetic letters, comma and space',
      queryParam: '$orderby=officeLocation,displayName desc',
      sanitizedQueryParam: '$orderby=officeLocation,displayName desc'
    },
    {
      check: 'returns <invalid-value> when $orderby value is not all alphabetic letters',
      queryParam: '$orderby=property123 asc',
      sanitizedQueryParam: '$orderby=<invalid-property> asc'
    },
    {
      check: 'returns value as is when $orderby value contains $count',
      queryParam: '$orderby=products/$count',
      sanitizedQueryParam: '$orderby=products/$count'
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
      check: 'returns <invalid-media-type> when media type in $format value contains characters that are not letters',
      queryParam: '$format=applicati0n/json',
      sanitizedQueryParam: '$format=<invalid-media-type>'
    },
    {
      check: 'returns <invalid-media-type> when media subtype type in $format value contains special characters',
      queryParam: '$format=application/json$',
      sanitizedQueryParam: '$format=<invalid-media-type>'
    },
    {
      check: 'returns <invalid-media-type> when parameters are not all letters',
      queryParam: '$format=application/json;odata=@minimalmetadata',
      sanitizedQueryParam: '$format=application/json;<invalid-parameter>'
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
    {
      check: 'returns sanitized value for $filter arithmetic operators',
      queryParam: '$filter=price sub 5 gt 10',
      sanitizedQueryParam: '$filter=price sub <value> gt <value>'
    },
    {
      check: 'returns sanitized value for $filter arithmetic operators within brackets',
      queryParam: '$filter=(price sub 5) gt 10',
      sanitizedQueryParam: '$filter=(price sub <value>) gt <value>'
    },
    {
      check: 'returns sanitize value for $filter query option value within quoted text',
      queryParam: '$filter=(creationDateTime ge 2017-06-25T07:00:00Z) and (creationDateTime le 2017-07-25T17:30:17Z)',
      sanitizedQueryParam: '$filter=(creationDateTime ge <value>) and (creationDateTime le <value>)'
    },
    {
      check: 'returns sanitized value with `any` collection operator for $filter query option',
      queryParam: '$filter=identities/any(c:c/issuerAssignedId eq \'j.smith@yahoo.com\')',
      sanitizedQueryParam: '$filter=identities/any(c: c/issuerAssignedId eq <value>)'
    },
    {
      check: 'returns sanitized value for $filter with `any` collection operator with fully qualified entity name',
      queryParam: '$filter=microsoft.graph.countryNamedLocation/countriesAndRegions/any(c:c eq \'CA\')',
      sanitizedQueryParam: '$filter=microsoft.graph.countryNamedLocation/countriesAndRegions/any(c: c eq <value>)'
    },
    {
      check: 'returns sanitized value with `any` collection operator with no arguments for $filter query option',
      queryParam: '$filter=not rooms/any()',
      sanitizedQueryParam: '$filter=not rooms/any()'
    },
    {
      check: 'returns sanitized value with `all` collection operator for $filter query option',
      queryParam: '$filter=ratings/all(r:r ge 3 and r le 5)',
      sanitizedQueryParam: '$filter=ratings/all(r: r ge <value> and r le <value>)'
    },
    {
      check: 'returns sanitized value with complex `all` collection operator for $filter query option',
      queryParam: '$filter=rooms/all(room: room/from/address eq \'street\'  and room/baseRate lt 100.0)',
      sanitizedQueryParam: '$filter=rooms/all(room: room/from/address eq <value> and room/baseRate lt <value>)'
    },
    {
      check: 'returns sanitized value for complex $filter query option value with potential catastrophic backtracking',
      queryParam:
        `$filter=isof('microsoft.graph.windowsUpdates.qualityUpdateCatalogEntry')
          and microsoft.graph.windowsUpdates.qualityUpdateCatalogEntry/isExpeditable eq true`,
      sanitizedQueryParam:
        '$filter=isof(<property>) and microsoft.graph.windowsUpdates.qualityUpdateCatalogEntry/isExpeditable eq <value>'
    },

    // $expand
    {
      check: 'returns value as is for simple $expand value',
      queryParam: '$expand=children',
      sanitizedQueryParam: '$expand=children'
    },
    {
      check: 'returns sanitized value of nested OData query option within $expand value',
      queryParam: '$expand=children($filter=firstname eq \'mary\')',
      sanitizedQueryParam: '$expand=children($filter=firstname eq <value>)'
    },
    {
      check: 'returns properly sanitized values for $expand value with multiple navigation properties',
      queryParam: '$expand=children($select=firstname,lastname),customers($top="five")',
      sanitizedQueryParam: '$expand=children($select=firstname,lastname),customers($top=<invalid-value>)'
    },
    {
      check: 'returns sanitized values with nested non-standard query option within $expand value',
      queryParam: '$expand=manager($levels=max;$select=id,displayName)',
      sanitizedQueryParam: '$expand=manager($levels=<value>;$select=id,displayName)'
    },
    {
      check: 'returns value as is for fully qualified entity name',
      queryParam: '$expand=microsoft.graph.itemattachment/item',
      sanitizedQueryParam: '$expand=microsoft.graph.itemattachment/item'
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
      sanitizedQueryParam: '<invalid-key>=<value>'
    },
    {
      check: 'returns value as is when query parameter key starts with $',
      queryParam: '$id=max',
      sanitizedQueryParam: '$id=<value>'
    },

    // Edge case: $search with non-property name before colon
    {
      check: 'returns <property> when $search quoted text has invalid property name before colon',
      queryParam: '$search="123:somevalue"',
      sanitizedQueryParam: '$search="<property>:<value>"'
    },

    // Edge case: $expand with invalid property name before opening bracket
    {
      check: 'returns <property> when $expand has invalid property name before nested query',
      queryParam: '$expand=123invalid($select=id)',
      sanitizedQueryParam: '$expand=<property>($select=id)'
    },

    // Edge case: $filter with lambda on invalid property name
    {
      check: 'returns <property> when $filter lambda has invalid collection property name',
      queryParam: '$filter=123items/any(c:c/id eq \'val\')',
      sanitizedQueryParam: '$filter=<property>/any(c: c/id eq <value>)'
    },

    // Edge case: $filter query function with no opening bracket (lines 441-442)
    {
      check: 'returns <unknown> when $filter has query function name without opening bracket',
      queryParam: '$filter=startswithNoBracket',
      sanitizedQueryParam: '$filter=startswith(<unknown>)'
    }

  ];

  list.forEach(element => {
    it(`should validate ${element.check}`, () => {
      const sanitizedQueryParam = sanitizeQueryParameter(element.queryParam);
      expect(sanitizedQueryParam).toEqual(element.sanitizedQueryParam);
    });
  });

});

describe('isAlphaNumeric should', () => {
  const cases = [
    { key: 'abc1def', expected: true },
    { key: 'a1b', expected: true },
    { key: 'abc', expected: false },
    { key: '123', expected: false },
    { key: 'a1', expected: true },
    { key: 'a', expected: false },
    { key: '1', expected: true },
    { key: 'test5', expected: true }
  ];

  cases.forEach(c => {
    it(`return ${c.expected} for "${c.key}"`, () => {
      expect(isAlphaNumeric(c.key)).toBe(c.expected);
    });
  });
});

describe('isPlaceHolderSegment should', () => {
  it('return true for {id}', () => {
    expect(isPlaceHolderSegment('{id}')).toBe(true);
  });
  it('return true for {user-id}', () => {
    expect(isPlaceHolderSegment('{user-id}')).toBe(true);
  });
  it('return false for plain text', () => {
    expect(isPlaceHolderSegment('users')).toBe(false);
  });
  it('return false for only opening brace', () => {
    expect(isPlaceHolderSegment('{id')).toBe(false);
  });
  it('return false for only closing brace', () => {
    expect(isPlaceHolderSegment('id}')).toBe(false);
  });
  it('return false for empty string', () => {
    expect(isPlaceHolderSegment('')).toBe(false);
  });
});

describe('sanitizeQueryParameter edge cases should', () => {
  it('return query parameter as-is when no equals sign', () => {
    expect(sanitizeQueryParameter('noequals')).toBe('noequals');
  });

  it('handle $count=false as valid', () => {
    expect(sanitizeQueryParameter('$count=false')).toBe('$count=false');
  });

  it('handle $search with bracketed subexpression', () => {
    const result = sanitizeQueryParameter('$search="description:One" AND ("displayName:Video" OR "displayName:Drive")');
    expect(result).toContain('$search=');
    expect(result).toContain('AND');
  });

  it('handle $filter with not operator', () => {
    const result = sanitizeQueryParameter('$filter=not startswith(displayName,\'Test\')');
    expect(result).toContain('$filter=');
    expect(result).toContain('not');
  });

  it('handle $expand with unknown segment', () => {
    const result = sanitizeQueryParameter('$expand=123invalid');
    expect(result).toContain('<unknown>');
  });

  it('handle $orderby with invalid sort direction', () => {
    const result = sanitizeQueryParameter('$orderby=displayName xyz');
    expect(result).toBe('$orderby=displayName <unexpected-value>');
  });

  it('handle $select with star operator', () => {
    expect(sanitizeQueryParameter('$select=*')).toBe('$select=*');
  });

  it('handle $format with invalid parameter', () => {
    const result = sanitizeQueryParameter('$format=application/json;123=abc');
    expect(result).toBe('$format=application/json;<invalid-parameter>');
  });

  it('handle $search with empty value', () => {
    const result = sanitizeQueryParameter('$search=');
    expect(result).toBe('$search=');
  });

  it('handle $filter with empty value', () => {
    const result = sanitizeQueryParameter('$filter=');
    expect(result).toBe('$filter=');
  });

  it('handle $search with non-quoted non-alpha segment', () => {
    const result = sanitizeQueryParameter('$search=123abc');
    expect(result).toContain('$search=');
    expect(result).toContain('<unknown>');
  });

  it('handle $filter with function call without comma', () => {
    const result = sanitizeQueryParameter('$filter=isof(\'microsoft.graph.user\')');
    expect(result).toContain('isof(');
  });

  it('handle $filter with bracket subexpression', () => {
    const result = sanitizeQueryParameter('$filter=(displayName eq \'test\')');
    expect(result).toContain('$filter=');
  });

  it('handle $expand with nested $expand', () => {
    const result = sanitizeQueryParameter('$expand=Items($expand=product),customer');
    expect(result).toContain('Items(');
    expect(result).toContain('customer');
  });

  it('handle non-OData key that starts with $ and is all alpha after $', () => {
    expect(sanitizeQueryParameter('$levels=max')).toBe('$levels=<value>');
  });

  it('handle $orderby with property/$count', () => {
    expect(sanitizeQueryParameter('$orderby=products/$count')).toBe('$orderby=products/$count');
  });
});