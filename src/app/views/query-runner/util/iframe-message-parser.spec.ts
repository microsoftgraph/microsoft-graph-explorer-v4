import { extractBody, extractHeaders, extractUrl, parse } from './iframe-message-parser';

describe('Iframe Message Parser', () => {
  it('parses url and verb correctly', () => {
    const message = `
    POST https://graph.microsoft.com/v1.0/me/calendars
    `;

    const parsedMessage = extractUrl(message);
    expect(parsedMessage).toEqual([
      { verb: 'POST' },
      { url: 'https://graph.microsoft.com/v1.0/me/calendars' }
    ]);
  });


  it('parses headers correctly', () => {
    const message = `
POST https://graph.microsoft.com/v1.0/me/calendars
Content-type: application/json
Prefer: A-timezone
     

`;

    const parsedMessage = extractHeaders(message);
    expect(parsedMessage).toEqual([
      { 'Content-type': 'application/json' },
      { 'Prefer': 'A-timezone'}
    ]);
  });

  it('parses body correctly', () => {
    const message = `
{ "name": "Volunteer" }
`;

    const parsedMessage = extractBody(message);
    expect(parsedMessage).toEqual('{ "name": "Volunteer" }');
  });

  it('parses th request snippet correctly', () => {
    const message = `
POST https://graph.microsoft.com/v1.0/me/calendars
Content-type: application/json
Prefer: A-timezone
     
{ "name": "Volunteer" }
`;

    const parsed = parse(message);
    expect(parsed).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/calendars',
      'Content-type': 'application/json',
      'Prefer': 'A-timezone',
      body: '{ "name": "Volunteer" }'
    });
  });
});
