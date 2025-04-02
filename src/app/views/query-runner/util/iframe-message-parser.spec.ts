/* eslint-disable max-len */
import { parse } from './iframe-message-parser';

describe('Iframe Message Parser', () => {
  it('parses http request snippet correctly', () => {
    const message = `POST https://graph.microsoft.com/beta/me/calendars
Content-type: application/json
Prefer: A-timezone

{ "name": "Volunteer" }`;

    const parsed = parse(message);
    expect(parsed).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/beta/me/calendars',
      headers: [
        { 'Content-type': 'application/json' },
        { 'Prefer': 'A-timezone' }
      ],
      body: '{ "name": "Volunteer" } '
    });
  });

  it('parses http request snippet without a domain correctly', () => {
    const message = `POST /me/calendars
Content-type: application/json
Prefer: A-timezone

{ "name": "Volunteer" }`;

    const parsed = parse(message);
    expect(parsed).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/calendars',
      headers: [
        { 'Content-type': 'application/json' },
        { 'Prefer': 'A-timezone' }
      ],
      body: '{ "name": "Volunteer" } '
    });
  });

  it('parses http request snippet  "Use $search and OData cast to get membership in groups with display names that contain the letters "tier" including a count of returned objects" correctly', () => {
    const message = `GET https://graph.microsoft.com/v1.0/users/{id}/memberOf/microsoft.graph.group?$count=true&$orderby=displayName&$search="displayName:tier"&$select=displayName,id
ConsistencyLevel: eventual`;

    const parsed = parse(message);
    expect(parsed).toEqual({
      verb: 'GET',
      url: 'https://graph.microsoft.com/v1.0/users/{id}/memberOf/microsoft.graph.group?$count=true&$orderby=displayName&$search="displayName:tier"&$select=displayName,id',
      headers: [
        { 'ConsistencyLevel': 'eventual' }
      ],
      body: ''
    });
  });

  it('parses http request snippet  "cast to get groups with a display name that starts with "a" correctly', () => {
    const message = `GET https://graph.microsoft.com/v1.0/users/{id}/memberOf/microsoft.graph.group?$count=true&$orderby=displayName&$filter=startswith(displayName, 'a')
ConsistencyLevel: eventual`;

    const parsed = parse(message);
    expect(parsed).toEqual({
      verb: 'GET',
      // eslint-disable-next-line quotes
      url: `https://graph.microsoft.com/v1.0/users/{id}/memberOf/microsoft.graph.group?$count=true&$orderby=displayName&$filter=startswith(displayName, 'a')`,
      headers: [
        { 'ConsistencyLevel': 'eventual' }
      ],
      body: ''
    });
  });
});
