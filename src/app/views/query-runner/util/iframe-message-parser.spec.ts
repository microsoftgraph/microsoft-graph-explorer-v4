import { getBody, getHeaders, getUrl, parse } from './iframe-message-parser';

describe('Iframe Message Parser', () => {
  it('parses url and verb correctly', () => {
    const message = `
    POST https://graph.microsoft.com/v1.0/me/calendars
    `;

    const parsedMessage = getUrl(message);
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

    const parsedMessage = getHeaders(message);
    expect(parsedMessage).toEqual([
      { 'Content-type': ' application/json' },
      { 'Prefer': ' A-timezone'}
    ]);
  });

  it('parses body correctly', () => {
    const message = `
{ "name": "Volunteer" }
`;

    const parsedMessage = getBody(message);
    expect(parsedMessage).toEqual('{ "name": "Volunteer" }');
  });
});
