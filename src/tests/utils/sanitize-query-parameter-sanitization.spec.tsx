import {
  sanitizeQueryParameter
} from '../../app/utils/query-parameter-sanitization';

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
      check: 'returns sanitized html decoded value for $filter query option',
      // tslint:disable-next-line: max-line-length
      queryParam: '$filter=(creationDateTime%20ge%202017-06-25T07:00:00Z)%20and%20(creationDateTime%20le%202017-07-25T17:30:17Z)',
      sanitizedQueryParam: '$filter=(creationDateTime ge <value>) and (creationDateTime le <value>)'
    },
    {
      check: 'returns sanitized value with `any` collection operator for $filter query option',
      queryParam: '$filter=identities/any(c:c/issuerAssignedId eq \'j.smith@yahoo.com\'',
      sanitizedQueryParam: '$filter=identities/any(c:c/issuerAssignedId eq <value>'
    },
    {
      check: 'returns sanitized value for $filter with `any` collection operator with fully qualified entity name',
      queryParam: '$filter=microsoft.graph.countryNamedLocation/countriesAndRegions/any(c:%20c%20eq%20\'CA\')',
      sanitizedQueryParam: '$filter=microsoft.graph.countryNamedLocation/countriesAndRegions/any(c: c eq <value>)'
    },
    {
      check: 'returns sanitized value with `any` collection operator with no arguments for $filter query option',
      queryParam: '$filter=not rooms/any()',
      sanitizedQueryParam: '$filter=not rooms/any()'
    },
    {
      check: 'returns sanitized value with `all` collection operator for $filter query option',
      queryParam: '$filter=ratings/all(r: r ge 3 and r le 5)',
      sanitizedQueryParam: '$filter=ratings/all(r: r ge <value> and r le <value>)'
    },
    {
      check: 'returns sanitized value with complex `all` collection operator for $filter query option',
      queryParam: '$filter=rooms/all(room: room/amenities/any(a: a eq \'tv\') and room/baseRate lt 100.0)',
      sanitizedQueryParam: '$filter=rooms/all(room: room/amenities/any(a: a eq <value>) and room/baseRate lt <value>)'
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
      queryParam: '$expand=children($select=firstname, lastname),customers($skip=10, $top="five")',
      sanitizedQueryParam: '$expand=children($select=firstname),customers($skip=10, $top=<invalid-value>)'
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
      queryParam: '$level=max',
      sanitizedQueryParam: '$level=<value>'
    }

  ];

  list.forEach(element => {
    it(`${element.check}`, () => {
      const sanitizedQueryParam = sanitizeQueryParameter(element.queryParam);
      expect(sanitizedQueryParam).toEqual(element.sanitizedQueryParam);
    });
  });

});